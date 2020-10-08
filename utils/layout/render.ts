import { Pub } from 'utils/types';
import {
	LayoutBlock,
	LayoutBlockPubs,
	LayoutRenderContext,
	PubSortOrder,
} from 'utils/layout/types';
import { sortByRank } from 'utils/rank';
import { partitionOn } from 'utils/arrays';

type PubQuery = {
	pinnedPubIds: string[];
	collectionIds: string[];
	sort: PubSortOrder;
	limit: number;
};

const sortPubsByCreationDate = (pubs: Pub[]) =>
	pubs.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

const sortPubsByCollectionRank = (pubs: Pub[], collectionIds: string[]): Pub[] => {
	const partitionedPubIds = new Set<string>();
	const collectionIdsToPubsMap: Record<string, Pub[]> = {};

	pubs.forEach((pub) => {
		if (pub.collectionPubs) {
			pub.collectionPubs.forEach(({ collectionId }) => {
				if (!collectionIdsToPubsMap[collectionId]) {
					collectionIdsToPubsMap[collectionId] = [];
				}
				collectionIdsToPubsMap[collectionId].push(pub);
			});
		}
	});

	return collectionIds
		.map((collectionId) => {
			const pubsInCollection = collectionIdsToPubsMap[collectionId];
			if (pubsInCollection) {
				const partition: Pub[] = [];
				pubsInCollection.forEach((pub) => {
					if (!partitionedPubIds.has(pub.id)) {
						partitionedPubIds.add(pub.id);
						partition.push(pub);
					}
				});
				return sortByRank(pubsInCollection);
			}
			return [];
		})
		.reduce((a, b) => [...a, ...b], []);
};

const getPubsForCollectionIds = (pubs: Pub[], collectionIds: string[]): Pub[] => {
	if (collectionIds.length === 0) {
		return pubs;
	}
	const collectionIdsSet = new Set(collectionIds);
	return pubs.filter(
		(pub) =>
			pub.collectionPubs &&
			pub.collectionPubs.some((collectionPub) =>
				collectionIdsSet.has(collectionPub.collectionId),
			),
	);
};

const createPubsPool = (pubs: Pub[]) => {
	const consumedPubIds = new Set<string>();

	const queryAndConsumePubs = (query: PubQuery): Pub[] => {
		const { pinnedPubIds, collectionIds, sort, limit } = query;
		const pinnedPubIdSet = new Set(pinnedPubIds);
		const matchingPubs = getPubsForCollectionIds(pubs, collectionIds).filter(
			(pub) => !consumedPubIds.has(pub.id),
		);
		const [pinnedPubs, restPubs] = partitionOn(matchingPubs, (pub) =>
			pinnedPubIdSet.has(pub.id),
		);
		const sortedPubs =
			sort === 'collection-rank'
				? sortPubsByCollectionRank(restPubs, collectionIds)
				: sortPubsByCreationDate(restPubs);
		const resolvedPubs = [...pinnedPubs, ...sortedPubs].slice(0, limit);
		const consumedPubs = resolvedPubs.slice(pinnedPubs.length);
		consumedPubs.forEach((pub) => consumedPubIds.add(pub.id));
		return resolvedPubs;
	};

	return { queryAndConsumePubs: queryAndConsumePubs };
};

export const getPubsByBlockIndex = (
	blocks: LayoutBlock[],
	pubs: Pub[],
	context: LayoutRenderContext = {},
) => {
	const { collectionId = '' } = context;
	const pool = createPubsPool(pubs);
	return blocks.map((block) => {
		if (block.type === 'pubs') {
			const { content } = block;
			return pool.queryAndConsumePubs({
				pinnedPubIds: content.pubIds || [],
				collectionIds: content.collectionIds || [],
				limit: content.limit || Infinity,
				sort: 'latest',
			});
		}
		if (block.type === 'collection') {
			const { content } = block;
			return pool.queryAndConsumePubs({
				pinnedPubIds: [],
				collectionIds: [collectionId],
				limit: content.limit || Infinity,
				sort: content.sort,
			});
		}
		return [];
	});
};
