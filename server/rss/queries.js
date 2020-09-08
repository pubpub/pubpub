import dateFormat from 'dateformat';
import { Op, QueryTypes } from 'sequelize';
import RSS from 'rss';

import { communityUrl as getCommunityUrl, pubUrl } from 'utils/canonicalUrls';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import ensureUserForAttribution from 'utils/ensureUserForAttribution';
import {
	sequelize,
	Community,
	Collection,
	CollectionPub,
	Pub,
	PubAttribution,
	PubEdge,
	Release,
	includeUserModel,
} from 'server/models';

const pubsIdsQuery = `
	WITH query_values (required_slugs, forbidden_slugs, published_before, published_after) AS (
		VALUES (
			Array[:requiredCollectionSlugs]::text[],
			Array[:forbiddenCollectionSlugs]::text[],
			:publishedBefore::timestamp,
			:publishedAfter::timestamp
		)
	)
	SELECT "pubId" FROM (
		SELECT 
			"pub"."id" as "pubId",
			"pub"."slug",
			"pub"."title",
			array_agg(distinct "collection"."slug") AS slugs,
			count("inboundEdge") + count("outboundEdge") as parents,
			coalesce("pub"."customPublishedAt", min("release"."createdAt")) as publication_date
		FROM "Pubs" AS "pub"
			-- Grab connection information
			LEFT OUTER JOIN "PubEdges" AS "inboundEdge" ON (
				"inboundEdge"."targetPubId" = "pub"."id" AND
				"inboundEdge"."pubIsParent" = true AND
				"inboundEdge"."approvedByTarget" = true
			)
			LEFT OUTER JOIN "PubEdges" AS "outboundEdge" ON (
				"outboundEdge"."pubId" = "pub"."id" AND 
				"outboundEdge"."pubIsParent" = false
			)
			-- Grab collection information to compare slugs
			LEFT OUTER JOIN "CollectionPubs" AS "collectionPub" ON "pub"."id" = "collectionPub"."pubId"
			LEFT OUTER JOIN "Collections" AS "collection" ON (
				"collectionPub"."collectionId" = "collection"."id" AND
				"collection"."isPublic" = true
			)
			-- We only want Pubs within a given community
			LEFT OUTER JOIN "Communities" AS "community" ON "pub"."communityId" = "community"."id"
			-- We need an associated Release
			INNER JOIN "Releases" AS "release" ON "pub"."id" = "release"."pubId"
		WHERE "community"."id" = :communityId
		GROUP BY "pub"."id"
	) AS results, query_values
	-- Check that there is overlap between the slugs and the required slugs
	WHERE (required_slugs = Array[]::text[] OR results.slugs && required_slugs)
	-- Check that there is no overlap between the slugs and the forbidden slugs
	AND NOT results.slugs && forbidden_slugs
	-- Check that the Pub is not a child, if that matters
	AND (:allowChildren OR results.parents = 0)
	-- Check that the Pub meets any provided date constraints
	AND (published_before IS NULL OR results.publication_date < published_before)
	AND (published_after IS NULL OR results.publication_date >= published_after)
	ORDER BY results.publication_date DESC
	LIMIT :limit
`;

const normalizeDate = (datelike) => dateFormat(new Date(datelike), 'yyyy-dd-mm');

const parseDateFilters = ({ publishedOn, publishedAfter, publishedBefore }) => {
	if (publishedOn) {
		return {
			publishedAfter: normalizeDate(publishedOn),
			publishedBefore: normalizeDate(new Date(publishedOn).valueOf() + 86400 * 1000),
		};
	}
	return {
		...(publishedAfter && { publishedAfter: normalizeDate(publishedAfter) }),
		...(publishedBefore && { publishedBefore: normalizeDate(publishedBefore) }),
	};
};

const parseCollectionConnectionFilters = ({ collections, connections }) => {
	const requiredCollectionSlugs = [];
	const forbiddenCollectionSlugs = [];
	(collections || '').split(',').forEach((slug) => {
		if (slug.startsWith('-')) {
			forbiddenCollectionSlugs.push(slug.slice(1));
		} else if (slug) {
			requiredCollectionSlugs.push(slug);
		}
	});
	const forbidChildren = connections === '0' || connections === 'false' || connections === false;
	return {
		allowChildren: !forbidChildren,
		requiredCollectionSlugs: requiredCollectionSlugs,
		forbiddenCollectionSlugs: forbiddenCollectionSlugs,
	};
};

export const getQueriedPubIds = async ({ communityId, limit, query }) => {
	const { publishedBefore = null, publishedAfter = null } = parseDateFilters(query);
	const {
		requiredCollectionSlugs = [],
		forbiddenCollectionSlugs = [],
		allowChildren = true,
	} = parseCollectionConnectionFilters(query);
	const rows = await sequelize.query(pubsIdsQuery, {
		type: QueryTypes.SELECT,
		replacements: {
			publishedBefore: publishedBefore,
			publishedAfter: publishedAfter,
			allowChildren: allowChildren,
			requiredCollectionSlugs: requiredCollectionSlugs,
			forbiddenCollectionSlugs: forbiddenCollectionSlugs,
			communityId: communityId,
			limit: limit,
		},
	});
	return rows.map((row) => row.pubId);
};

const getPubData = async (pubIds) => {
	const pubs = await Pub.findAll({
		where: {
			id: {
				[Op.in]: pubIds,
			},
		},
		include: [
			{
				model: PubAttribution,
				as: 'attributions',
				required: false,
				include: [
					includeUserModel({
						as: 'user',
					}),
				],
			},
			{
				model: Release,
				as: 'releases',
				attributes: ['createdAt'],
			},
			{
				model: PubEdge,
				as: 'inboundEdges',
			},
			{
				model: PubEdge,
				as: 'outboundEdges',
			},
			{
				model: CollectionPub,
				as: 'collectionPubs',
				attributes: ['collectionId', 'pubId'],
				include: [
					{
						model: Collection,
						as: 'collection',
						attributes: ['slug'],
					},
				],
			},
		],
	});
	// pubIds are already in publication-date order, so sort results based on that.
	return pubs.sort((a, b) => pubIds.indexOf(a.id) - pubIds.indexOf(b.id));
};

export const getCommunityRss = async (communityData, query) => {
	const communityUrl = getCommunityUrl(communityData);
	const pubIds = await getQueriedPubIds({
		communityId: communityData.id,
		limit: 25,
		query: query,
	});
	const pubs = await getPubData(pubIds);

	const feed = new RSS({
		title: communityData.title,
		description: communityData.description,
		feed_url: `${communityUrl}/rss.xml`,
		site_url: communityUrl,
		image_url: communityData.favicon,
		webMaster: 'hello@pubpub.org',
		language: 'en',
		pubDate: new Date(),
		ttl: '60',
	});

	pubs.forEach((pubData) => {
		feed.item({
			title: pubData.title,
			description: pubData.description,
			url: pubUrl(communityData, pubData),
			guid: pubData.id,
			date: getPubPublishedDate(pubData),
			enclosure: {
				url: pubData.avatar,
			},
		});
	});

	return feed.xml();
};
