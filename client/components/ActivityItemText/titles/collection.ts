import { CollectionActivityItem, MemberActivityItem } from 'types';
import { getDashUrl } from 'utils/dashboard';

import { TitleRenderer } from '../types';
import { getCollectionFromContext } from './util';

type AcceptedItem = CollectionActivityItem | (MemberActivityItem & { collectionId: string });

export const titleCollection: TitleRenderer<AcceptedItem> = (item, context) => {
	const isInCollectionScope =
		'collectionId' in context.scope && context.scope.collectionId === item.collectionId;

	if (isInCollectionScope) {
		return {
			title: 'this Collection',
		};
	}

	const collectionFromContext = getCollectionFromContext(item.collectionId, context);
	if (collectionFromContext) {
		return {
			title: collectionFromContext.title,
			href: getDashUrl({ collectionSlug: collectionFromContext.slug }),
		};
	}
	if ('collection' in item.payload) {
		return {
			title: item.payload.collection.title,
		};
	}
	return {
		title: 'an unknown Collection',
	};
};
