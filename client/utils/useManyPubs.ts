import { useCallback, useEffect, useState } from 'react';
import { usePageContext } from 'utils/hooks';

import { getPubPublishedDate } from 'utils/pub/pubDates';
import {
	Pub,
	PubsQuery,
	PubsQueryOrderingField,
	DefinitelyHas,
	PubsQueryOrdering,
} from 'utils/types';
import { indexByProperty } from 'utils/arrays';
import { apiFetch } from 'client/utils/apiFetch';

type OrderedPubsQuery = DefinitelyHas<PubsQuery, 'ordering'>;
type OrderingValue = string | number;
type OrderByFn = (pub: Pub, scopedCollectionId?: string) => OrderingValue;

type Options = {
	query?: Omit<PubsQuery, 'communityId' | 'limit' | 'offset'>;
	batchSize?: number;
};

type OrderedPubs = {
	pubsById: Record<string, Pub>;
	orderingValuesByPubId: Record<string, OrderingValue>;
	pubsInOrder: Pub[];
};

type PubsByQueryKey = Record<string, OrderedPubs>;

const defaultQueryPartial = {
	ordering: { field: 'creationDate', direction: 'ASC' } as const,
};

const valueOrderedBelowAnyDate = 'a'; // Since any date starts with a number
const orderingFunctions: Record<PubsQueryOrderingField, OrderByFn> = {
	collectionRank: (pub, scopedCollectionId) => {
		if (scopedCollectionId) {
			const collectionPub = pub.collectionPubs?.find((cp) => cp.id === scopedCollectionId);
			if (collectionPub) {
				return collectionPub.rank;
			}
		}
		return '';
	},
	creationDate: (pub) => pub.createdAt,
	publishDate: (pub) => getPubPublishedDate(pub)?.toString() || valueOrderedBelowAnyDate,
	updatedDate: (pub) => {
		const dates = [pub.draft?.latestKeyAt, pub.updatedAt].filter((x): x is string => !!x);
		return dates.reduce(
			(latest, next) => (latest > next ? latest : next),
			valueOrderedBelowAnyDate,
		);
	},
};

const getQueryKey = (query: OrderedPubsQuery) => {
	const {
		term = '',
		scopedCollectionId = '',
		ordering: { field, direction },
	} = query;
	return JSON.stringify({ term, scopedCollectionId, field, direction });
};

const getOrderingValuesByPubId = (
	pubsById: Record<string, Pub>,
	ordering: PubsQueryOrdering,
	scopedCollectionId?: string,
) => {
	const orderingValues: Record<string, OrderingValue> = {};
	const orderingFunction = orderingFunctions[ordering.field];
	Object.entries(pubsById).forEach(([id, pub]) => {
		orderingValues[id] = orderingFunction(pub, scopedCollectionId);
	});
	return orderingValues;
};

const getPubsInOrder = (
	pubsById: Record<string, Pub>,
	orderingValuesByPubId: Record<string, OrderingValue>,
	ordering: PubsQueryOrdering,
) => {
	const sortedPubs = Object.values(pubsById).sort((a, b) =>
		orderingValuesByPubId[a.id] > orderingValuesByPubId[b.id] ? 1 : -1,
	);
	if (ordering.direction === 'DESC') {
		sortedPubs.reverse();
	}
	return sortedPubs;
};

const getNextPubsByQueryKey = (
	pubsByQueryKey: PubsByQueryKey,
	query: OrderedPubsQuery,
	newPubsById: Record<string, Pub>,
): PubsByQueryKey => {
	const queryKey = getQueryKey(query);
	const { ordering, scopedCollectionId } = query;
	const { pubsById = {}, orderingValuesByPubId = {} } = pubsByQueryKey[queryKey] || {};
	const newOrderingBalues = getOrderingValuesByPubId(newPubsById, ordering, scopedCollectionId);
	const nextPubsById = { ...pubsById, ...newPubsById };
	const nextOrderingValuesByPubId = {
		...orderingValuesByPubId,
		...newOrderingBalues,
	};
	const nextOrderedPubs: OrderedPubs = {
		orderingValuesByPubId: nextOrderingValuesByPubId,
		pubsById: nextPubsById,
		pubsInOrder: getPubsInOrder(nextPubsById, nextOrderingValuesByPubId, ordering),
	};
	return {
		...pubsByQueryKey,
		[queryKey]: nextOrderedPubs,
	};
};

export const useManyPubs = (options: Options = {}) => {
	const { query: optionsQuery, batchSize = 50 } = options;
	const { communityData } = usePageContext();
	const [offset, setOffset] = useState(0);
	const [isLoadingPubs, setIsLoadingPubs] = useState(false);
	const [pubsByQueryKey, setPubsByQueryKey] = useState<PubsByQueryKey>({});

	const query: OrderedPubsQuery = {
		...defaultQueryPartial,
		...optionsQuery,
		offset,
		limit: batchSize,
		communityId: communityData.id,
	};

	const queryKey = getQueryKey(query);
	const currentPubs = pubsByQueryKey[queryKey]?.pubsInOrder || [];

	const loadMorePubs = useCallback(() => {
		if (!isLoadingPubs) {
			setOffset((current) => current + batchSize);
		}
	}, [isLoadingPubs, batchSize]);

	useEffect(() => {
		setIsLoadingPubs(true);
		apiFetch.post('/api/pubs/many', { query }).then((pubs: Pub[]) => {
			const pubsById = indexByProperty(pubs, 'id');
			setIsLoadingPubs(false);
			setPubsByQueryKey((current) => getNextPubsByQueryKey(current, query, pubsById));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryKey, offset]);

	return {
		pubs: currentPubs,
		loadMorePubs,
		isLoadingPubs,
	};
};
