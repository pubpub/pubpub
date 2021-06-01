import React from 'react';

import {
	CollectionCreatedActivityItem,
	CollectionUpdatedActivityItem,
	CollectionRemovedActivityItem,
	CollectionPubCreatedActivityItem,
	CollectionPubRemovedActivityItem,
} from 'types';

import { renderItem } from '../renderItem';
import { titleCollection, titlePub } from '../titles';

type BaseTitles = 'collection';
type CollectionPubTitles = BaseTitles | 'pub';

export const renderCollectionCreated = renderItem<CollectionCreatedActivityItem, BaseTitles>({
	icon: 'collection',
	titles: {
		collection: titleCollection,
	},
	message: ({ titles }) => {
		const { actor, collection } = titles;
		return (
			<>
				{actor} created {collection}
			</>
		);
	},
});

export const renderCollectionUpdated = renderItem<CollectionUpdatedActivityItem, BaseTitles>({
	icon: 'collection',
	titles: {
		collection: titleCollection,
	},
	message: ({ titles, item }) => {
		const { payload } = item;
		const { actor, collection } = titles;
		if (payload.title) {
			return (
				<>
					{actor} changed the title of {collection} from {payload.title.from} to{' '}
					{payload.title.to}
				</>
			);
		}
		if (payload.layout) {
			return (
				<>
					{actor} updated the layout of {collection}
				</>
			);
		}
		if (payload.doi) {
			return (
				<>
					{actor} set the DOI of {collection} to {payload.doi.to}
				</>
			);
		}
		if (payload.metadata) {
			return (
				<>
					{actor} updated the metadata for {collection}
				</>
			);
		}
		if (payload.isRestricted) {
			const isNowRestricted = payload.isRestricted.to;
			if (isNowRestricted) {
				return (
					<>
						{actor} made {collection} restricted
					</>
				);
			}
			return (
				<>
					{actor} made {collection} open
				</>
			);
		}
		if (payload.isPublic) {
			const isNowPublic = payload.isPublic.to;
			if (isNowPublic) {
				return (
					<>
						{actor} made {collection} public
					</>
				);
			}
			return (
				<>
					{actor} made {collection} private
				</>
			);
		}
		return (
			<>
				{actor} updated the settings for {collection}
			</>
		);
	},
});

export const renderCollectionRemoved = renderItem<CollectionRemovedActivityItem, BaseTitles>({
	icon: 'collection',
	titles: {
		collection: titleCollection,
	},
	message: ({ titles }) => {
		const { actor, collection } = titles;
		return (
			<>
				{actor} removed {collection}
			</>
		);
	},
});

export const renderCollectionPubCreated = renderItem<
	CollectionPubCreatedActivityItem,
	CollectionPubTitles
>({
	icon: 'pubDoc',
	titles: {
		collection: titleCollection,
		pub: titlePub,
	},
	message: ({ titles }) => {
		const { actor, pub, collection } = titles;
		return (
			<>
				{actor} added {pub} to {collection}
			</>
		);
	},
});

export const renderCollectionPubRemoved = renderItem<
	CollectionPubRemovedActivityItem,
	CollectionPubTitles
>({
	icon: 'pubDoc',
	titles: {
		collection: titleCollection,
		pub: titlePub,
	},
	message: ({ titles }) => {
		const { actor, pub, collection } = titles;
		return (
			<>
				{actor} removed {pub} from {collection}
			</>
		);
	},
});
