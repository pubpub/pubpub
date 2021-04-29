import { Op } from 'sequelize';

import { Collection, CollectionPub, ScopeSummary } from 'server/models';
import { getManyPubs } from 'server/pub/queryMany';
import { InitialData } from 'utils/types';
import { getUserScopeVisits } from 'server/userScopeVisit/queries';

type Options = {
	loadPubs?: number;
};

const getCollection = async (collectionId: string) => {
	const collection = await Collection.findOne({
		where: { id: collectionId },
		include: [{ model: ScopeSummary, as: 'scopeSummary' }],
	});
	return collection.toJSON();
};

const getCollectionPubs = async (collectionId: string) => {
	const collectionPubs = await CollectionPub.findAll({ where: { collectionId } });
	return collectionPubs.map((cp) => cp.toJSON());
};

const getRecentItems = async (initialData: InitialData) => {
	const {
		loginData: { id: userId },
		communityData: { id: communityId },
	} = initialData;
	const userScopeVisits = await getUserScopeVisits({ userId, communityId });
	const recentCollections = await Collection.findAll({
		where: {
			communityId,
			id: {
				[Op.in]: userScopeVisits.map(({ collectionId }) => collectionId).filter((x) => x),
			},
		},
	});
	const pubResult = await getManyPubs({
		query: {
			withinPubIds: userScopeVisits.map(({ pubId }) => pubId).filter((x) => x),
			communityId,
		},
	});
	const recentPubs = await pubResult.sanitize(initialData);
	return {
		userScopeVisits,
		recentCollections,
		recentPubs,
	};
};

const getPubs = async (initialData: InitialData, collectionId: string, limit: number) => {
	const { communityData } = initialData;
	const result = await getManyPubs({
		query: {
			limit,
			communityId: communityData.id,
			scopedCollectionId: collectionId,
			ordering: { field: 'collectionRank', direction: 'ASC' },
		},
		options: {
			getCollections: true,
		},
	});
	return result.sanitize(initialData);
};

export const getCollectionOverview = async (initialData: InitialData, options: Options = {}) => {
	const { loadPubs = 200 } = options;
	const { activeCollection } = initialData.scopeData.elements;
	const collectionId = activeCollection!.id;

	const [collection, collectionPubs, pubs, recentItems] = await Promise.all([
		getCollection(collectionId),
		getCollectionPubs(collectionId),
		getPubs(initialData, collectionId, loadPubs),
		getRecentItems(initialData),
	]);

	return {
		collection,
		pubs,
		collectionPubs,
		...recentItems,
		includesAllPubs: pubs.length < loadPubs,
	};
};
