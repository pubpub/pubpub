import React, { useMemo, useState } from 'react';
import { NonIdealState } from '@blueprintjs/core';

import { Collection, Pub, PubsQuery } from 'types';
import { fuzzyMatchCollection } from 'utils/fuzzyMatch';
import { useManyPubs } from 'client/utils/useManyPubs';
import { useInfiniteScroll } from 'client/utils/useInfiniteScroll';

import {
	PubOverviewRow,
	ExpandableCollectionOverviewRow,
	OverviewRows,
	LoadMorePubsRow,
	SpecialRow,
} from '../overviewRows';
import { KindToggle, OverviewSearchGroup } from '../helpers';

require('./submissionItems.scss');

type Props = {
	collections: Collection[];
	initialPubs: Pub[];
	initiallyLoadedAllPubs: boolean;
};

const filteredData = [
	{ id: 'all', title: 'All', query: null },
	{
		id: 'pending',
		title: 'Pending',
		query: { ordering: { field: 'creationDate', direction: 'DESC' } },
	},
	{ id: 'released', title: 'Released', query: { isReleased: false } },
	{ id: 'declined', title: 'Declined', query: { isReleased: true } },
];

const SubmissionItems = (props: Props) => {
	const { collections: allCollections, initialPubs, initiallyLoadedAllPubs } = props;
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState<null | Partial<PubsQuery>>(null);
	const [showPubs, setShowPubs] = useState(true);
	const [showCollections, setShowCollections] = useState(true);
	const [showSubmissions, setShowSubmissions] = useState(false);
	const isSearchingOrFiltering = !!filter || !!searchTerm;
	const collections = useMemo(
		() => allCollections.filter((collection) => fuzzyMatchCollection(collection, searchTerm)),
		[allCollections, searchTerm],
	);

	const {
		currentQuery: { pubs, isLoading, hasLoadedAllPubs, loadMorePubs },
	} = useManyPubs({
		isEager: isSearchingOrFiltering,
		initialPubs,
		initiallyLoadedAllPubs,
		batchSize: 200,
		query: {
			term: searchTerm,
			ordering: { field: 'title', direction: 'ASC' },
			...filter,
		},
	});

	const canShowCollections = !filter;
	const canLoadMorePubs = !hasLoadedAllPubs && showPubs;

	useInfiniteScroll({
		enabled: !isLoading && canLoadMorePubs,
		useDocumentElement: true,
		onRequestMoreItems: loadMorePubs,
	});

	const renderCollections = () => {
		return collections.map((collection) => (
			<ExpandableCollectionOverviewRow collection={collection} key={collection.id} />
		));
	};

	const renderPubs = () => {
		return pubs.map((pub) => <PubOverviewRow pub={pub} key={pub.id} />);
	};

	const renderEmptyState = () => {
		if (collections.length === 0) {
			if (initialPubs.length === 0) {
				return (
					<NonIdealState
						icon="clean"
						title="There doesn't seem to be any"
						description="No submissions have been submitted yet"
					/>
				);
			}
			if (pubs.length === 0 && hasLoadedAllPubs && isSearchingOrFiltering) {
				return <SpecialRow>No matching Pubs or Collections.</SpecialRow>;
			}
		}
		return null;
	};

	return (
		<div className="submission-items-component">
			<OverviewSearchGroup
				placeholder="Search Submitted Pubs"
				onUpdateSearchTerm={(t) => t === '' && setSearchTerm(t)}
				onCommitSearchTerm={setSearchTerm}
				onChooseFilter={setFilter}
				filter={filteredData}
				rightControls={
					<>
						<KindToggle
							selected={showSubmissions}
							onSelect={() => {
								setShowSubmissions(!showSubmissions);
							}}
							icon="pubDoc"
							label="Submitted"
							count={hasLoadedAllPubs ? pubs.length : `${pubs.length}+`}
							disabled={!canShowCollections}
						/>
					</>
				}
			/>
			<OverviewRows>
				{showCollections && canShowCollections && renderCollections()}
				{showPubs && renderPubs()}
				{canLoadMorePubs && <LoadMorePubsRow isLoading />}
				{renderEmptyState()}
			</OverviewRows>
		</div>
	);
};

export default SubmissionItems;
