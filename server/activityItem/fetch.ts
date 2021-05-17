import { Op } from 'sequelize';

import * as types from 'types';
import { IdIndex } from 'types';
import { ActivityItem, CollectionPub } from 'server/models';

const associationTypes = [
	'collectionPubs',
	'collections',
	'communities',
	'discussions',
	'externalPublications',
	'pubEdges',
	'pubs',
	'reviews',
	'releases',
	'threadComments',
	'threads',
	'users',
] as const;

type AssociationType = typeof associationTypes[number];
type AssociationIds = Record<AssociationType, string[]>;
type AssociationRecord<T> = T extends Record<AssociationType, any> ? T : never;

type Associations = AssociationRecord<
	IdIndexes<{
		collectionPubs: types.CollectionPub;
		collections: types.Collection;
		communities: types.Community;
		discussions: types.Discussion;
		externalPublications: types.ExternalPublication;
		pubEdges: types.PubEdge;
		pubs: types.Pub;
		releases: types.Release;
		reviews: types.Review;
		threadComments: types.ThreadComment;
		threads: types.Thread;
		users: types.User;
	}>
>;

type Scope = { communityId: string } & ({ pubId: string } | { collectionId: string });
type IdIndexes<T extends { [k: string]: any }> = { [k in keyof T]: IdIndex<T[k]> };

type FetchActivityItemsOptions = {
	scope: Scope;
	limit?: number;
	offset?: number;
};

type FetchActivityItemsResult = {
	activityItems: types.ActivityItem[];
	associations: Associations;
};

const createAssociationsArray = <T>(
	getDefaultValue: () => T,
): Record<AssociationType, ReturnType<typeof getDefaultValue>> => {
	const associations = {};
	associationTypes.forEach((type) => {
		associations[type] = getDefaultValue();
	});
	return associations as Record<AssociationType, ReturnType<typeof getDefaultValue>>;
};

const createAssociationsIdsArray = () => createAssociationsArray(() => [] as string[]);
const createAssociationsModelsArray = () => createAssociationsArray(() => ({}));

const getPubsWhereQueryForScope = async (scope: Scope) => {
	if ('pubId' in scope) {
		return { pubId: scope.pubId };
	}
	if ('collectionId' in scope) {
		const collectionPubs = await CollectionPub.findAll({
			where: { collectionId: scope.collectionId },
			attributes: ['pubId'],
		});
		return {
			pubId: {
				[Op.in]: collectionPubs.map((cp) => cp.pubId),
			},
		};
	}
	return null;
};

const fetchActivityItemModels = async (
	options: FetchActivityItemsOptions,
): Promise<types.ActivityItem[]> => {
	const { scope, limit = 50, offset = 0 } = options;
	return ActivityItem.findAll({
		limit,
		offset,
		where: {
			communityId: scope.communityId,
			...(await getPubsWhereQueryForScope(scope)),
		},
	});
};

const getActivityItemAssociationIds = (items: types.ActivityItem[]): AssociationIds => {
	const associationIds = createAssociationsIdsArray();
	const {
		collectionPubs,
		collections,
		communities,
		discussions,
		externalPublications,
		pubEdges,
		pubs,
		releases,
		reviews,
		threadComments,
		threads,
		users,
	} = associationIds;
	items.forEach((item) => {
		communities.push(item.communityId);
		users.push(item.actorId);
		if (item.collectionId) {
			collections.push(item.collectionId);
		}
		if (item.pubId) {
			pubs.push(item.pubId);
		}
		if (item.kind === 'collection-pub-created' || item.kind === 'collection-pub-removed') {
			collections.push(item.collectionId);
			collectionPubs.push(item.payload.collectionPubId);
		} else if (item.kind === 'pub-discussion-comment-added') {
			discussions.push(item.payload.discussionId);
			threads.push(item.payload.threadId);
			threadComments.push(item.payload.threadComment.id);
		} else if (item.kind === 'pub-review-created' || item.kind === 'pub-review-updated') {
			reviews.push(item.payload.reviewId);
		} else if (item.kind === 'pub-review-comment-added') {
			reviews.push(item.payload.reviewId);
			threads.push(item.payload.threadId);
			threadComments.push(item.payload.threadComment.id);
		} else if (item.kind === 'pub-edge-created' || item.kind === 'pub-edge-removed') {
			pubEdges.push(item.payload.pubEdgeId);
			if ('externalPublication' in item.payload.target) {
				externalPublications.push(item.payload.target.externalPublication.id);
			}
		} else if (item.kind === 'pub-released') {
			releases.push(item.payload.releaseId);
		}
	});
	return associationIds;
};

const fetchActivityItems = async (options: FetchActivityItemsOptions) => {
	const activityItemModels = await fetchActivityItemModels(options);
};
