import React, { useState } from 'react';
import { NonIdealState } from '@blueprintjs/core';

import { Collection, Pub, PubsQuery } from 'types';
import { useManyPubs } from 'client/utils/useManyPubs';
import { useInfiniteScroll } from 'client/utils/useInfiniteScroll';

import { PubOverviewRow, OverviewRows, LoadMorePubsRow, SpecialRow } from '../overviewRows';
import { KindToggle, OverviewSearchGroup, OverviewSearchFilter } from '../helpers';

require('./submissionItems.scss');

type Props = {
	collection: Collection;
	initialPubs: Pub[];
	initiallyLoadedAllPubs: boolean;
};

const defaultQuery: Partial<PubsQuery> = { submissionStatuses: ['incomplete'] };

const filteredData: OverviewSearchFilter[] = [
	{ id: 'all', title: 'All', query: defaultQuery },
	// {
	// 	id: 'pending',
	// 	title: 'Pending',
	// 	query: { ordering: { field: 'creationDate', direction: 'DESC' } },
	// },
	// { id: 'accepted', title: 'Accepted', query: { isReleased: false } },
	// { id: 'declined', title: 'Declined', query: { isReleased: true } },
];

const SubmissionItems = (props: Props) => {
	const { collection, initialPubs, initiallyLoadedAllPubs } = props;
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState(filteredData[0].query);
	const [showPubs] = useState(true);
	const [showSubmissions, setShowSubmissions] = useState(false);
	const isSearchingOrFiltering = !!filter || !!searchTerm;

	const {
		currentQuery: { pubs, isLoading, hasLoadedAllPubs, loadMorePubs },
	} = useManyPubs({
		isEager: isSearchingOrFiltering,
		initialPubs,
		initiallyLoadedAllPubs,
		batchSize: 200,
		query: {
			term: searchTerm,
			scopedCollectionId: collection.id,
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

	const renderPubs = () => {
		return pubs.map((pub) => <PubOverviewRow pub={pub} key={pub.id} />);
	};

	const renderEmptyState = () => {
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
		return null;
	};

	return (
		<div className="submission-items-component">
			<OverviewSearchGroup
				placeholder="Enter keyword to search submissions"
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
				{showPubs && renderPubs()}
				{canLoadMorePubs && <LoadMorePubsRow isLoading />}
				{renderEmptyState()}
			</OverviewRows>
		</div>
	);
};

export default SubmissionItems;
