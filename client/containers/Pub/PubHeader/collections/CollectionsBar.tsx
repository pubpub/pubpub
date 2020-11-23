import React from 'react';
import { OverflowList } from '@blueprintjs/core';

import { pubDataProps } from 'types/pub';
import { chooseCollectionForPub } from 'client/utils/collections';
import { collectionUrl } from 'utils/canonicalUrls';
import { getSchemaForKind } from 'utils/collections/schemas';
import { usePageContext } from 'utils/hooks';
import { Menu, MenuItem } from 'components/Menu';

import CollectionBrowser from './CollectionBrowser';
import CollectionsBarButton from './CollectionsBarButton';

require('./collectionsBar.scss');

type Props = {
	pubData: pubDataProps;
	updateLocalData: (...args: any[]) => any;
};

const CollectionsBar = (props: Props) => {
	const { pubData, updateLocalData } = props;
	const { communityData, locationData } = usePageContext();
	const currentCollection = chooseCollectionForPub(pubData, locationData);

	// @ts-expect-error ts-migrate(2339) FIXME: Property 'collectionPubs' does not exist on type '... Remove this comment to see the full error message
	if (pubData.collectionPubs.length === 0) {
		return null;
	}

	return (
		<div className="collections-bar-component">
			{currentCollection && (
				<CollectionBrowser
					collection={currentCollection}
					currentPub={pubData}
					updateLocalData={updateLocalData}
				/>
			)}
			<OverflowList
				className="collections-list"
				collapseFrom="end"
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'collectionPubs' does not exist on type '... Remove this comment to see the full error message
				items={pubData.collectionPubs
					.filter(
						(collectionPub) =>
							collectionPub.collection &&
							collectionPub.collection !== currentCollection,
					)
					.sort(
						(a, b) =>
							a.collection.title.toLowerCase() - b.collection.title.toLowerCase(),
					)}
				visibleItemRenderer={({ collection }) => (
					<CollectionsBarButton
						key={collection.id}
						href={collectionUrl(communityData, collection)}
						// @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: any; key: any; href: string; as:... Remove this comment to see the full error message
						as="a"
					>
						{collection.title}
					</CollectionsBarButton>
				)}
				overflowRenderer={(overflowCollections) => {
					const containsAllCollections =
						// @ts-expect-error ts-migrate(2339) FIXME: Property 'collectionPubs' does not exist on type '... Remove this comment to see the full error message
						overflowCollections.length === pubData.collectionPubs.length;
					const icon = containsAllCollections ? null : 'more';
					const rightIcon = containsAllCollections ? 'caret-down' : null;
					const label = containsAllCollections
						? overflowCollections.length === 1
							? 'collection'
							: 'collections'
						: 'more';
					return (
						<Menu
							placement="bottom-end"
							aria-label={overflowCollections.length + ' ' + label}
							disclosure={
								// @ts-expect-error ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
								<CollectionsBarButton icon={icon} rightIcon={rightIcon}>
									{overflowCollections.length} {label}
								</CollectionsBarButton>
							}
						>
							{/* @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ collection }: { collection: a... Remove this comment to see the full error message */}
							{overflowCollections.map(({ collection }) => {
								const schema = getSchemaForKind(collection.kind);
								return (
									<MenuItem
										icon={schema && schema.bpDisplayIcon}
										key={collection.id}
										text={collection.title}
										href={collectionUrl(communityData, collection)}
									/>
								);
							})}
						</Menu>
					);
				}}
			/>
		</div>
	);
};
export default CollectionsBar;
