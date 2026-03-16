import { QueryTypes } from 'sequelize';

import { sequelize } from 'server/sequelize';

export type PubSearchResult = {
	id: string;
	title: string;
	slug: string;
	avatar: string | null;
	description: string | null;
	customPublishedAt: string | null;
	communityId: string;
	communityTitle: string;
	communitySlug: string;
	communityDomain: string | null;
	communityAvatar: string | null;
	communityAccentColorDark: string | null;
	communityAccentColorLight: string | null;
	communityHeaderLogo: string | null;
	communityTextColor: string | null;
	byline: string | null;
	rank: number;
};

export type CommunitySearchResult = {
	id: string;
	title: string;
	subdomain: string;
	domain: string | null;
	description: string | null;
	avatar: string | null;
	accentColorDark: string | null;
	headerLogo: string | null;
	pubCount: number;
	rank: number;
};

export type SearchFields = 'title' | 'description' | 'byline' | 'content';

type AuthorFacet = { name: string; count: number };

/**
 * Sanitize user input into a tsquery with prefix matching.
 * e.g. "hello world" -> "hello:* & world:*"
 */
const buildTsQuery = (searchTerm: string): string | null => {
	const sanitized = searchTerm.trim().replace(/[^\w\s-]/g, '');
	const terms = sanitized.split(/\s+/).filter(Boolean);
	if (terms.length === 0) return null;
	return terms.map((w) => `${w}:*`).join(' & ');
};

/**
 * Search pubs using PostgreSQL full-text search.
 *
 * Strategy: First find matching pubs via title/description/byline (fast),
 * then optionally search release doc content for additional matches.
 * The two result sets are unioned and ranked together.
 *
 * Only returns publicly released pubs. Excludes spam communities.
 */
export const searchPubs = async (
	searchTerm: string,
	{
		limit = 20,
		offset = 0,
		communityId,
		fields,
		author,
	}: {
		limit?: number;
		offset?: number;
		communityId?: string;
		fields?: SearchFields[];
		author?: string;
	} = {},
): Promise<{ results: PubSearchResult[]; total: number; facets: { authors: AuthorFacet[] } }> => {
	const tsQuery = buildTsQuery(searchTerm);
	if (!tsQuery) return { results: [], total: 0, facets: { authors: [] } };

	const searchFields = fields && fields.length > 0 ? fields : ['title', 'description', 'byline'];
	const searchTitle = searchFields.includes('title');
	const searchDescription = searchFields.includes('description');
	const searchByline = searchFields.includes('byline');
	const searchContent = searchFields.includes('content');

	const communityFilter = communityId ? `AND p."communityId" = :communityId` : '';
	const authorFilter = author
		? `AND EXISTS (SELECT 1 FROM "PubAttributions" af LEFT JOIN "Users" au ON au.id = af."userId" WHERE af."pubId" = p.id AND af."isAuthor" = true AND (af.name ILIKE :authorFilter OR au."fullName" ILIKE :authorFilter))`
		: '';
	const ilikeTerm = `%${searchTerm.trim().replace(/[%_]/g, '')}%`;

	// Two-phase approach:
	// Phase 1 (metadata): Search title, description, byline with tsvector + ILIKE fallback
	// Phase 2 (content): Search doc text extracted from latest release — uses a
	//   targeted LATERAL extraction only on candidate docs, not all Docs rows.
	// We UNION these and deduplicate, taking the max rank.
	const query = `
    WITH latest_release AS (
      SELECT DISTINCT ON (r."pubId") r."pubId", r."docId"
      FROM "Releases" r
      ORDER BY r."pubId", r."createdAt" DESC
    ),
    pub_bylines AS (
      SELECT pa."pubId",
             string_agg(COALESCE(u."fullName", pa.name), ', ' ORDER BY pa."order") AS byline
      FROM "PubAttributions" pa
      LEFT JOIN "Users" u ON u.id = pa."userId"
      INNER JOIN latest_release lr2 ON lr2."pubId" = pa."pubId"
      WHERE pa."isAuthor" = true
        AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL)
      GROUP BY pa."pubId"
    ),
    released_pubs AS (
      SELECT
        p.id,
        p.title,
        p.slug,
        p.avatar,
        p.description,
        p."customPublishedAt",
        c.id AS "communityId",
        c.title AS "communityTitle",
        c.subdomain AS "communitySlug",
        c.domain AS "communityDomain",
        c.avatar AS "communityAvatar",
        c."accentColorDark" AS "communityAccentColorDark",
        c."accentColorLight" AS "communityAccentColorLight",
        c."headerLogo" AS "communityHeaderLogo",
        c."accentTextColor" AS "communityTextColor",
        pb.byline,
        lr."docId"
      FROM "Pubs" p
      INNER JOIN "Communities" c ON c.id = p."communityId"
      INNER JOIN latest_release lr ON lr."pubId" = p.id
      LEFT JOIN pub_bylines pb ON pb."pubId" = p.id
      LEFT JOIN "SpamTags" st ON st.id = c."spamTagId"
      WHERE (st.status IS NULL OR st.status != 'confirmed')
        ${communityFilter}
        ${authorFilter}
    ),
    -- Phase 1: metadata search (title, description, byline)
    metadata_matches AS (
      SELECT
        rp.*,
        ts_rank_cd(
          ${searchTitle ? `setweight(to_tsvector('english', coalesce(rp.title, '')), 'A')` : `to_tsvector('')`} ||
          ${searchDescription ? `setweight(to_tsvector('english', coalesce(rp.description, '')), 'B')` : `to_tsvector('')`} ||
          ${searchByline ? `setweight(to_tsvector('english', coalesce(rp.byline, '')), 'C')` : `to_tsvector('')`},
          to_tsquery('english', :tsQuery)
        ) AS rank
      FROM released_pubs rp
      WHERE (
        ${searchTitle ? `setweight(to_tsvector('english', coalesce(rp.title, '')), 'A')` : `to_tsvector('')`} ||
        ${searchDescription ? `setweight(to_tsvector('english', coalesce(rp.description, '')), 'B')` : `to_tsvector('')`} ||
        ${searchByline ? `setweight(to_tsvector('english', coalesce(rp.byline, '')), 'C')` : `to_tsvector('')`}
      ) @@ to_tsquery('english', :tsQuery)
      ${searchTitle ? `OR rp.title ILIKE :ilikeTerm` : ''}
    ),
    ${
		searchContent
			? `
    -- Phase 2: full-text content search (only for pubs not already matched)
    content_matches AS (
      SELECT
        rp.*,
        ts_rank_cd(
          to_tsvector('english', coalesce(doc_plain.plain_text, '')),
          to_tsquery('english', :tsQuery)
        ) * 0.5 AS rank
      FROM released_pubs rp
      INNER JOIN LATERAL (
        SELECT string_agg(elem.txt, ' ') AS plain_text
        FROM (
          WITH RECURSIVE nodes(node) AS (
            SELECT d.content FROM "Docs" d WHERE d.id = rp."docId"
            UNION ALL
            SELECT jsonb_array_elements(nodes.node->'content')
            FROM nodes
            WHERE nodes.node->'content' IS NOT NULL
              AND jsonb_typeof(nodes.node->'content') = 'array'
          )
          SELECT node->>'text' AS txt
          FROM nodes
          WHERE node->>'text' IS NOT NULL
        ) elem
      ) doc_plain ON true
      WHERE rp.id NOT IN (SELECT mm.id FROM metadata_matches mm)
        AND to_tsvector('english', coalesce(doc_plain.plain_text, ''))
            @@ to_tsquery('english', :tsQuery)
    ),`
			: ''
	}
    -- Combine both phases
    combined AS (
      SELECT * FROM metadata_matches
      ${searchContent ? `UNION ALL SELECT * FROM content_matches` : ''}
    ),
    facet_data AS (
      SELECT json_agg(sub) AS facets FROM (
        SELECT COALESCE(u."fullName", pa.name) AS name, count(DISTINCT pa."pubId")::int AS count
        FROM "PubAttributions" pa
        LEFT JOIN "Users" u ON u.id = pa."userId"
        WHERE pa."pubId" IN (SELECT id FROM combined)
          AND pa."isAuthor" = true
          AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL)
        GROUP BY COALESCE(u."fullName", pa.name)
        ORDER BY count DESC, name ASC
        LIMIT 15
      ) sub
    )
    SELECT
      id, title, slug, avatar, description, "customPublishedAt",
      "communityId", "communityTitle", "communitySlug", "communityDomain",
      "communityAvatar", "communityAccentColorDark", "communityAccentColorLight",
      "communityHeaderLogo", "communityTextColor", byline,
      rank,
      count(*) OVER() AS total,
      (SELECT facets FROM facet_data) AS "authorFacets"
    FROM combined
    ORDER BY rank DESC
    LIMIT :limit
    OFFSET :offset
  `;

	try {
		const results = await sequelize.query(query, {
			replacements: {
				tsQuery,
				ilikeTerm,
				limit,
				offset,
				...(communityId ? { communityId } : {}),
				...(author ? { authorFilter: author } : {}),
			},
			type: QueryTypes.SELECT,
		});

		const total = results.length > 0 ? Number((results[0] as any).total) : 0;
		const authorFacetsJson = results.length > 0 ? (results[0] as any).authorFacets : null;
		const facets: { authors: AuthorFacet[] } = {
			authors: Array.isArray(authorFacetsJson) ? authorFacetsJson : [],
		};

		return {
			results: results.map((r: any) => ({
				id: r.id,
				title: r.title,
				slug: r.slug,
				avatar: r.avatar,
				description: r.description,
				customPublishedAt: r.customPublishedAt,
				communityId: r.communityId,
				communityTitle: r.communityTitle,
				communitySlug: r.communitySlug,
				communityDomain: r.communityDomain,
				communityAvatar: r.communityAvatar,
				communityAccentColorDark: r.communityAccentColorDark,
				communityAccentColorLight: r.communityAccentColorLight,
				communityHeaderLogo: r.communityHeaderLogo,
				communityTextColor: r.communityTextColor,
				byline: r.byline,
				rank: r.rank,
			})),
			total,
			facets,
		};
	} catch (err) {
		console.error('searchPubs full query error, falling back to metadata-only:', err);
		return searchPubsSimple(searchTerm, { limit, offset, communityId });
	}
};

/**
 * Fallback: metadata-only pub search (no doc content). Used if the full
 * content query times out or errors.
 */
const searchPubsSimple = async (
	searchTerm: string,
	{
		limit = 20,
		offset = 0,
		communityId,
	}: { limit?: number; offset?: number; communityId?: string } = {},
): Promise<{ results: PubSearchResult[]; total: number; facets: { authors: AuthorFacet[] } }> => {
	const tsQuery = buildTsQuery(searchTerm);
	if (!tsQuery) return { results: [], total: 0, facets: { authors: [] } };

	const communityFilter = communityId ? `AND p."communityId" = :communityId` : '';
	const ilikeTerm = `%${searchTerm.trim().replace(/[%_]/g, '')}%`;

	const query = `
    WITH latest_release AS (
      SELECT DISTINCT ON (r."pubId") r."pubId"
      FROM "Releases" r
      ORDER BY r."pubId", r."createdAt" DESC
    ),
    pub_bylines AS (
      SELECT pa."pubId",
             string_agg(COALESCE(u."fullName", pa.name), ', ' ORDER BY pa."order") AS byline
      FROM "PubAttributions" pa
      LEFT JOIN "Users" u ON u.id = pa."userId"
      INNER JOIN latest_release lr2 ON lr2."pubId" = pa."pubId"
      WHERE pa."isAuthor" = true
        AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL)
      GROUP BY pa."pubId"
    ),
    matching_pubs AS (
      SELECT
        p.id, p.title, p.slug, p.avatar, p.description, p."customPublishedAt",
        c.id AS "communityId",
        c.title AS "communityTitle",
        c.subdomain AS "communitySlug",
        c.domain AS "communityDomain",
        c.avatar AS "communityAvatar",
        c."accentColorDark" AS "communityAccentColorDark",
        c."accentColorLight" AS "communityAccentColorLight",
        c."headerLogo" AS "communityHeaderLogo",
        c."accentTextColor" AS "communityTextColor",
        pb.byline,
        ts_rank_cd(
          setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(p.description, '')), 'B') ||
          setweight(to_tsvector('english', coalesce(pb.byline, '')), 'C'),
          to_tsquery('english', :tsQuery)
        ) AS rank
      FROM "Pubs" p
      INNER JOIN "Communities" c ON c.id = p."communityId"
      INNER JOIN latest_release lr ON lr."pubId" = p.id
      LEFT JOIN pub_bylines pb ON pb."pubId" = p.id
      LEFT JOIN "SpamTags" st ON st.id = c."spamTagId"
      WHERE (st.status IS NULL OR st.status != 'confirmed')
        ${communityFilter}
        AND (
          (
            setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(p.description, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(pb.byline, '')), 'C')
          ) @@ to_tsquery('english', :tsQuery)
          OR p.title ILIKE :ilikeTerm
        )
    ),
    facet_data AS (
      SELECT json_agg(sub) AS facets FROM (
        SELECT COALESCE(u."fullName", pa.name) AS name, count(DISTINCT pa."pubId")::int AS count
        FROM "PubAttributions" pa
        LEFT JOIN "Users" u ON u.id = pa."userId"
        WHERE pa."pubId" IN (SELECT id FROM matching_pubs)
          AND pa."isAuthor" = true
          AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL)
        GROUP BY COALESCE(u."fullName", pa.name)
        ORDER BY count DESC, name ASC
        LIMIT 15
      ) sub
    )
    SELECT
      mp.*,
      count(*) OVER() AS total,
      (SELECT facets FROM facet_data) AS "authorFacets"
    FROM matching_pubs mp
    ORDER BY rank DESC
    LIMIT :limit
    OFFSET :offset
  `;

	const results = await sequelize.query(query, {
		replacements: {
			tsQuery,
			ilikeTerm,
			limit,
			offset,
			...(communityId ? { communityId } : {}),
		},
		type: QueryTypes.SELECT,
	});

	const total = results.length > 0 ? Number((results[0] as any).total) : 0;
	const authorFacetsJson = results.length > 0 ? (results[0] as any).authorFacets : null;
	const facets: { authors: AuthorFacet[] } = {
		authors: Array.isArray(authorFacetsJson) ? authorFacetsJson : [],
	};

	return {
		results: results.map((r: any) => ({
			id: r.id,
			title: r.title,
			slug: r.slug,
			avatar: r.avatar,
			description: r.description,
			customPublishedAt: r.customPublishedAt,
			communityId: r.communityId,
			communityTitle: r.communityTitle,
			communitySlug: r.communitySlug,
			communityDomain: r.communityDomain,
			communityAvatar: r.communityAvatar,
			communityAccentColorDark: r.communityAccentColorDark,
			communityAccentColorLight: r.communityAccentColorLight,
			communityHeaderLogo: r.communityHeaderLogo,
			communityTextColor: r.communityTextColor,
			byline: r.byline,
			rank: r.rank,
		})),
		total,
		facets,
	};
};

/**
 * Search communities using PostgreSQL full-text search.
 * Searches over: title, description.
 * Excludes confirmed-spam communities.
 */
export const searchCommunities = async (
	searchTerm: string,
	{ limit = 20, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<{ results: CommunitySearchResult[]; total: number }> => {
	const tsQuery = buildTsQuery(searchTerm);
	if (!tsQuery) return { results: [], total: 0 };

	const ilikeTerm = `%${searchTerm.trim().replace(/[%_]/g, '')}%`;

	const query = `
    WITH community_pub_counts AS (
      SELECT p."communityId", count(DISTINCT p.id) AS pub_count
      FROM "Pubs" p
      INNER JOIN "Releases" r ON r."pubId" = p.id
      GROUP BY p."communityId"
    )
    SELECT
      c.id,
      c.title,
      c.subdomain,
      c.domain,
      c.description,
      c.avatar,
      c."accentColorDark",
      c."headerLogo",
      coalesce(cpc.pub_count, 0)::int AS "pubCount",
      ts_rank_cd(
        setweight(to_tsvector('english', coalesce(c.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(c.description, '')), 'B'),
        to_tsquery('english', :tsQuery)
      ) AS rank,
      count(*) OVER() AS total
    FROM "Communities" c
    LEFT JOIN "SpamTags" st ON st.id = c."spamTagId"
    LEFT JOIN community_pub_counts cpc ON cpc."communityId" = c.id
    WHERE (st.status IS NULL OR st.status != 'confirmed')
      AND (
        (
          setweight(to_tsvector('english', coalesce(c.title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(c.description, '')), 'B')
        ) @@ to_tsquery('english', :tsQuery)
        OR c.title ILIKE :ilikeTerm
      )
    ORDER BY rank DESC
    LIMIT :limit
    OFFSET :offset
  `;

	const results = await sequelize.query(query, {
		replacements: { tsQuery, ilikeTerm, limit, offset },
		type: QueryTypes.SELECT,
	});

	const total = results.length > 0 ? Number((results[0] as any).total) : 0;

	return {
		results: results.map((r: any) => ({
			id: r.id,
			title: r.title,
			subdomain: r.subdomain,
			domain: r.domain,
			description: r.description,
			avatar: r.avatar,
			accentColorDark: r.accentColorDark,
			headerLogo: r.headerLogo,
			pubCount: r.pubCount,
			rank: r.rank,
		})),
		total,
	};
};
