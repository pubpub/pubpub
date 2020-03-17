import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, NonIdealState } from '@blueprintjs/core';
import { DragDropContext } from 'react-beautiful-dnd';
import classNames from 'classnames';

import { DragDropListing } from 'components';
import { usePageContext } from 'utils/hooks';
import { groupPubs } from 'utils/dashboard';
import { getSchemaForKind } from 'shared/collections/schemas';

import { useCollectionPubs } from './collectionState';
import { fuzzyMatchCollection, fuzzyMatchPub } from './util';
import OverviewRow from './OverviewRow';
import PubControls from './PubControls';

require('./overviewTable.scss');

const propTypes = {
	overviewData: PropTypes.object.isRequired,
};
const handleDragDrop = ({ dragResult, reorderCollectionPubs }) => {
	const { source, destination } = dragResult;
	reorderCollectionPubs(source.index, destination.index);
};

const OverviewTable = (props) => {
	const { overviewData } = props;
	const [filterText, setFilterText] = useState('');
	const { scopeData } = usePageContext();
	const { canManage } = scopeData.activePermissions;
	const { activeTargetType, activeCollection } = scopeData.elements;
	const isCollectionView = activeTargetType === 'collection';
	const title = isCollectionView ? 'Pubs' : 'Pubs & Collections';
	const { pubs, collections } = groupPubs(overviewData);

	const {
		collectionPubs,
		reorderCollectionPubs,
		setCollectionPubContextHint,
		setCollectionPubIsPrimary,
		removeCollectionPub,
	} = useCollectionPubs({ scopeData: scopeData, overviewData: overviewData });

	const collectionSchema = isCollectionView ? getSchemaForKind(activeCollection.kind) : undefined;
	const filterCollections = () => {
		if (isCollectionView) {
			return [];
		}
		return collections
			.map((cl) => {
				if (fuzzyMatchCollection(cl, filterText)) {
					return cl;
				}
				const filteredPubs = cl.pubs.filter((pub) => fuzzyMatchPub(pub, filterText));
				if (filteredPubs.length) {
					return { ...cl, pubs: filteredPubs };
				}
				return null;
			})
			.filter((coll) => !!coll);
	};

	const pubList = isCollectionView ? collectionPubs : pubs;
	const filterPubs = () => {
		return pubList.filter((pub) => fuzzyMatchPub(pub, filterText));
	};

	const filteredItems = [...filterCollections(), ...filterPubs()];

	return (
		<div className="overview-table-component">
			<div className="table-title">{title}</div>
			<InputGroup
				className="filter-input"
				fill
				large
				leftIcon="search"
				placeholder={`Filter ${title}`}
				value={filterText}
				onChange={(evt) => {
					setFilterText(evt.target.value);
				}}
			/>
			<div className={classNames({ list: true, 'collection-list': isCollectionView })}>
				<div className="list-header overview-row-component">
					<span className="handle" />
					<span className="type">Type</span>
					<span className="title">Title</span>
					<span className="pubs">Pubs</span>
					<span className="released">Released</span>
					<span className="discussions">Discussions</span>
					<span className="reviews">Reviews</span>
					<span className="pub-options" />
				</div>
				<DragDropContext
					onDragEnd={(dragResult) =>
						handleDragDrop({
							dragResult: dragResult,
							reorderCollectionPubs: reorderCollectionPubs,
						})
					}
				>
					<DragDropListing
						disabled={!canManage}
						itemId={(item) => item.pubId || item.id}
						items={filteredItems}
						renderItem={(item, dragHandleProps, isDragging) => {
							const contextHint =
								collectionSchema &&
								collectionSchema.contextHints.find(
									(ch) => ch.value === item.contextHint,
								);
							return (
								<OverviewRow
									label={contextHint && contextHint.label}
									content={item.pub || item}
									dragHandleProps={isCollectionView ? dragHandleProps : null}
									isDragging={isDragging}
									controls={
										item.pub && (
											<PubControls
												collectionPub={item}
												setCollectionPubContextHint={
													setCollectionPubContextHint
												}
												setCollectionPubIsPrimary={
													setCollectionPubIsPrimary
												}
												removeCollectionPub={removeCollectionPub}
											/>
										)
									}
									parentSlug={
										activeCollection ? activeCollection.slug : undefined
									}
								>
									{item.pubs &&
										item.pubs.map((pub) => {
											const slug =
												item.slug ||
												item.title.toLowerCase().replace(/ /gi, '-');
											return (
												<OverviewRow
													key={`${item.id}-${pub.id}`}
													content={pub}
													parentSlug={slug}
												/>
											);
										})}
								</OverviewRow>
							);
						}}
						renderEmptyState={() => {
							if (pubList.length > 0) {
								return (
									<NonIdealState
										icon="search"
										title="No matching Pubs to show."
									/>
								);
							}
							return (
								<NonIdealState
									icon={collectionSchema.bpDisplayIcon}
									title={`This ${collectionSchema.label.singular} doesn't contain any pubs yet!`}
									description="Choose 'Add Pubs' from above to add some."
								/>
							);
						}}
						droppableId="collectionsListing"
						droppableType="COLLECTION_PUB"
						withDragHandles={canManage}
					/>
				</DragDropContext>
			</div>
		</div>
	);
};

OverviewTable.propTypes = propTypes;
export default OverviewTable;
