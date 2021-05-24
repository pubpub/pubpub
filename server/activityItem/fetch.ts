import { Op } from 'sequelize';

import * as types from 'types';
import {
	ActivityAssociations,
	ActivityAssociationType,
	activityAssociationTypes,
	ActivityAssociationIds,
	ActivityItemsContext,
	WithId,
	IdIndex,
} from 'types';
import {
	ActivityItem,
	Collection,
	CollectionPub,
	Community,
	Discussion,
	ExternalPublication,
	Pub,
	PubEdge,
	Release,
	Review,
	Thread,
	ThreadComment,
	User,
} from 'server/models';
import { indexById } from 'utils/arrays';

type PromiseRecord<T extends { [k: string]: any }> = {
	[K in keyof T]: Promise<T[K]>;
};

type Scope = { communityId: string } & ({ pubId: string } | { collectionId: string } | {});

type FetchActivityItemsOptions = {
	scope: Scope;
	limit?: number;
	offset?: number;
};

const createAssociationsArrays = (): Record<ActivityAssociationType, string[]> => {
	const associations = {};
	activityAssociationTypes.forEach((type) => {
		associations[type] = [] as string[];
	});
	return associations as Record<ActivityAssociationType, string[]>;
};

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
	const models = await ActivityItem.findAll({
		limit,
		offset,
		where: {
			communityId: scope.communityId,
			...(await getPubsWhereQueryForScope(scope)),
		},
		orderBy: [['createdAt', 'DESC']],
	});
	return models.map((model) => model.toJSON());
};

const getActivityItemAssociationIds = (items: types.ActivityItem[]): ActivityAssociationIds => {
	const associationIds = createAssociationsArrays();
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

const fetchModels = async <T extends WithId>(Model: any, ids: string[]): Promise<IdIndex<T>> => {
	if (ids.length === 0) {
		return {};
	}
	const models = await Model.findAll({ where: { id: { [Op.in]: [...new Set(ids)] } } });
	return indexById(models as T[]);
};

const awaitAssociations = async (
	promised: PromiseRecord<ActivityAssociations>,
): Promise<ActivityAssociations> => {
	const associations: Partial<ActivityAssociations> = {};
	const keyValuePairs = await Promise.all(
		Object.entries(promised).map(async ([key, promise]) => {
			const value = await promise;
			return [key, value] as const;
		}),
	);
	keyValuePairs.forEach(([key, value]) => {
		associations[key] = value;
	});
	return associations as ActivityAssociations;
};

const fetchAssociations = (
	associationIds: ActivityAssociationIds,
): Promise<ActivityAssociations> => {
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
	return awaitAssociations({
		collectionPubs: fetchModels<types.CollectionPub>(CollectionPub, collectionPubs),
		collections: fetchModels<types.Collection>(Collection, collections),
		communities: fetchModels<types.Community>(Community, communities),
		discussions: fetchModels<types.Discussion>(Discussion, discussions),
		externalPublications: fetchModels<types.ExternalPublication>(
			ExternalPublication,
			externalPublications,
		),
		pubEdges: fetchModels<types.PubEdge>(PubEdge, pubEdges),
		pubs: fetchModels<types.Pub>(Pub, pubs),
		releases: fetchModels<types.Release>(Release, releases),
		reviews: fetchModels<types.Review>(Review, reviews),
		threadComments: fetchModels<types.ThreadComment>(ThreadComment, threadComments),
		threads: fetchModels<types.Thread>(Thread, threads),
		users: fetchModels<types.User>(User, users),
	});
};

export const fetchActivityItems = async (
	options: FetchActivityItemsOptions,
): Promise<ActivityItemsContext> => {
	const activityItems = await fetchActivityItemModels(options);
	const associationIds = getActivityItemAssociationIds(activityItems);
	const associations = await fetchAssociations(associationIds);
	return { activityItems, associations };
};
