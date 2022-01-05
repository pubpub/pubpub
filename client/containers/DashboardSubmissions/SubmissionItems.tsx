import React, { useState } from 'react';
import { NonIdealState, Button, Dialog } from '@blueprintjs/core';

import { Collection, Pub, PubsQuery } from 'types';
import { Icon, IconName, DialogLauncher } from 'client/components';
import { useManyPubs } from 'client/utils/useManyPubs';
import { useInfiniteScroll } from 'client/utils/useInfiniteScroll';

import {
	PubOverviewRow,
	OverviewRows,
	LoadMorePubsRow,
	SpecialRow,
} from '../DashboardOverview/overviewRows';
import { OverviewSearchGroup, OverviewSearchFilter } from '../DashboardOverview/helpers';

require('./submissionItems.scss');

type Props = {
	collection: Collection;
	initialPubs: Pub[];
	initiallyLoadedAllPubs: boolean;
};

type SubManageDialogProps = {
	isOpen: boolean;
	actionTitle: string;
	actionHelpText: string;
	onClose: (...args: any[]) => any;
};

const SubManageDialog = (props: SubManageDialogProps) => {
	const { isOpen, onClose, actionTitle, actionHelpText } = props;
	return (
		<Dialog
			lazy={true}
			title={`${actionTitle} This Submission`}
			className="submissionManagementDialog"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>{actionHelpText}</div>
		</Dialog>
	);
};

const queriesForSubmissionPubs: Record<string, Partial<PubsQuery>> = {
	default: {
		submissionStatuses: ['pending', 'accepted', 'declined'],
	},
	pending: {
		submissionStatuses: ['pending'],
	},
	accepted: {
		submissionStatuses: ['accepted'],
	},
	declined: {
		submissionStatuses: ['declined'],
	},
};

const overviewSearchFilters: OverviewSearchFilter[] = [
	{
		id: 'pending',
		title: 'Pending',
		query: queriesForSubmissionPubs.pending,
	},
	{ id: 'accepted', title: 'Accepted', query: queriesForSubmissionPubs.accepted },
	{ id: 'declined', title: 'Declined', query: queriesForSubmissionPubs.declined },
	{ id: 'all', title: 'All', query: queriesForSubmissionPubs.default },
];

const SubmissionItems = (props: Props) => {
	const { collection, initialPubs, initiallyLoadedAllPubs } = props;
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState<null | Partial<PubsQuery>>(null);
	const isSearchingOrFiltering = !!filter || !!searchTerm;

	const {
		currentQuery: { pubs, isLoading, hasLoadedAllPubs, loadMorePubs },
	} = useManyPubs({
		isEager: isSearchingOrFiltering,
		initialPubs,
		initiallyLoadedAllPubs,
		batchSize: 200,
		pubOptions: { getSubmissions: true },
		query: {
			term: searchTerm,
			scopedCollectionId: collection.id,
			...filter,
		},
	});

	const canLoadMorePubs = !hasLoadedAllPubs;
	useInfiniteScroll({
		enabled: !isLoading && canLoadMorePubs,
		useDocumentElement: true,
		onRequestMoreItems: loadMorePubs,
	});

	const submissionManagementOptions = [
		{
			icon: 'cross',
			actionTitle: 'Delete',
			actionHelpText: 'Would you like to delete this Submission?',
			onSubmit: () => console.log('they chose death'),
		},
		{
			icon: 'thumbs-down',
			actionTitle: 'Decline',
			actionHelpText: 'Would you like to decline this Submission?',
			onSubmit: () => console.log('they chose death'),
		},
		{
			icon: 'endorsed',
			actionTitle: 'Accept',
			actionHelpText: 'Would you like to accept this Submission?',
			onSubmit: () => console.log('they chose death'),
		},
	];

	const rightElement = (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gridTemplateRows: '1fr',
				gridColumnGap: '40px',
			}}
		>
			{submissionManagementOptions.map((option, index) => (
				<div style={{ gridColumn: index + 1 }}>
					<DialogLauncher
						renderLauncherElement={({ openDialog }) => (
							<Button
								minimal
								small
								icon={<Icon icon={option.icon as IconName} iconSize={20} />}
								onClick={openDialog}
							/>
						)}
					>
						{({ isOpen, onClose }) => (
							<SubManageDialog
								actionTitle={option.actionTitle}
								isOpen={isOpen}
								onClose={onClose}
								actionHelpText={option.actionHelpText}
							/>
						)}
					</DialogLauncher>
				</div>
			))}
		</div>
	);

	const renderPubs = () => {
		return pubs.map((pub) => (
			<PubOverviewRow
				pub={pub}
				key={pub.id}
				leftIconElement="manually-entered-data"
				hasSubmission={true}
				rightElement={rightElement}
			/>
		));
	};

	const renderEmptyState = () => {
		if (initialPubs.length === 0) {
			return (
				<NonIdealState
					icon="clean"
					title="There doesn't seem to be any submissions"
					description="Try reaching out to members of your community for submissions"
				/>
			);
		}
		if (pubs.length === 0 && hasLoadedAllPubs && isSearchingOrFiltering) {
			return <SpecialRow>No Submissions have been found.</SpecialRow>;
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
				filters={overviewSearchFilters}
			/>
			<OverviewRows>
				{renderPubs()}
				{canLoadMorePubs && <LoadMorePubsRow isLoading />}
				{renderEmptyState()}
			</OverviewRows>
		</div>
	);
};

export default SubmissionItems;
