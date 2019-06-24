import React, { useContext } from 'react';
import { Menu, MenuItem, OverflowList, Popover, Position, Tag } from '@blueprintjs/core';

import { pubDataProps } from 'types/pub';
import { collectionUrl } from 'shared/utils/canonicalUrls';
import { getSchemaForKind } from 'shared/collections/schemas';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import CollectionBrowser from 'components/CollectionBrowser/CollectionBrowser';

require('./collectionsBar.scss');

const propTypes = {
	pubData: pubDataProps.isRequired,
};

const iconForCollection = (collection) => getSchemaForKind(collection.kind).bpDisplayIcon;

const CollectionsBar = (props) => {
	const { pubData } = props;
	const { communityData } = useContext(PageContext);
	const primaryCollectionPub = pubData.collectionPubs.find((cp) => cp.isPrimary);
	const currentCollectionPub = primaryCollectionPub;
	return (
		<div className="collections-bar-component">
			{primaryCollectionPub && (
				<CollectionBrowser
					className="themed-button-component"
					collection={primaryCollectionPub.collection}
					currentPub={pubData}
				/>
			)}
			<OverflowList
				className="collections-list"
				collapseFrom="end"
				items={pubData.collectionPubs
					.filter(
						(collectionPub) =>
							collectionPub.collection && collectionPub !== currentCollectionPub,
					)
					.sort(
						(a, b) =>
							a.collection.title.toLowerCase() - b.collection.title.toLowerCase(),
					)}
				visibleItemRenderer={({ collection }) => (
					<a
						className="header-collection"
						href={collectionUrl(communityData, collection)}
					>
						<Tag key={collection.id} icon={iconForCollection(collection)}>
							{collection.title}
						</Tag>
					</a>
				)}
				overflowRenderer={(collectionPubs) => (
					<Popover
						minimal
						modifiers={{
							preventOverflow: { enabled: false },
							hide: { enabled: false },
						}}
						position={Position.TOP_LEFT}
						className="header-collection"
						content={
							<Menu>
								{collectionPubs.map(({ collection }) => (
									<MenuItem
										icon={iconForCollection(collection)}
										text={collection.title}
										href={collectionUrl(communityData, collection)}
									/>
								))}
							</Menu>
						}
					>
						<Tag icon="more" className="overflow-tag" interactive={true}>
							{collectionPubs.length} more
						</Tag>
					</Popover>
				)}
			/>
		</div>
	);
};

CollectionsBar.propTypes = propTypes;
export default CollectionsBar;
