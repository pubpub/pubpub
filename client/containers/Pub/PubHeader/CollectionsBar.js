import React, { useContext } from 'react';
import { AnchorButton, Button, OverflowList, Menu, MenuItem, Popover } from '@blueprintjs/core';

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
				collapseFrom="end"
				items={pubData.collectionPubs
					.filter((collectionPub) => collectionPub.collection)
					.sort(
						(a, b) =>
							a.collection.title.toLowerCase() - b.collection.title.toLowerCase(),
					)}
				visibleItemRenderer={(collectionPub) => (
					<div className="themed-button-component collections-bar-button">
						<AnchorButton
							key={collectionPub.id}
							icon={iconForCollection(collectionPub.collection)}
							href={collectionUrl(communityData, collectionPub.collection)}
						>
							{collectionPub.collection.title}
						</AnchorButton>
					</div>
				)}
				overflowRenderer={(collectionPubs) => (
					<Popover
						minimal
						content={
							<Menu>
								{collectionPubs.map((collectionPub) => (
									<MenuItem
										text={collectionPub.collection.title}
										href={collectionUrl(
											communityData,
											collectionPub.collection,
										)}
									/>
								))}
							</Menu>
						}
					>
						<div className="themed-button-component collections-bar-button">
							<Button icon="more">{collectionPubs.length} more</Button>
						</div>
					</Popover>
				)}
			/>
		</div>
	);
};

CollectionsBar.propTypes = propTypes;
export default CollectionsBar;
