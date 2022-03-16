import React, { useState } from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';

import { DocJson, DefinitelyHas, PubHistoryState, PubPageData, SubmissionStatus } from 'types';
import { assert } from 'utils/assert';
import { apiFetch } from 'client/utils/apiFetch';
import { getEmptyDoc } from 'components/Editor';
import { PendingChangesProvider } from 'components';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import ContributorsTab from './ContributorsTab';
import PreviewTab from './PreviewTab';
import SpubHeaderToolBar from './SpubHeaderToolBar';

require('./spubHeader.scss');

type Props = {
	historyData: PubHistoryState;
	updateLocalData: (
		type: string,
		patch: Partial<PubPageData> | Partial<PubHistoryState>,
	) => unknown;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
};

const SpubHeader = (props: Props) => {
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	const [abstract, setAbstract] = useState(
		() => props.pubData.submission.abstract || getEmptyDoc(),
	);
	const [status, setStatus] = useState(() => props.pubData.submission.status);

	const updateAbstract = async (newAbstract: DocJson) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				abstract: newAbstract,
				id: props.pubData.submission.id,
			}),
		}).then(() => setAbstract(newAbstract));
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		props.updateLocalData('pub', newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: props.pubData.id,
				communityId: props.pubData.communityId,
			}),
		}).catch(() => props.updateLocalData('pub', props.pubData));
	};

	const updateSubmissionStatus = async (newSubmissionStatus: SubmissionStatus) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				status: newSubmissionStatus,
				id: props.pubData.submission.id,
			}),
		}).then(() => setStatus(newSubmissionStatus));
	};
	console.log('not in use yet', updateSubmissionStatus, status);

	assert(props.pubData.submission.submissionWorkflow !== undefined);
	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return props.updateLocalData('history', newHistoryData);
	};

	return (
		<PendingChangesProvider>
			<SpubHeaderToolBar
				onSelectTab={(t) => setSelectedTab(t)}
				selectedTab={selectedTab}
				showSubmitButton={true}
				onSubmit={() => {}}
				status={status}
			/>
			<Tabs id="spubHeader" selectedTabId={selectedTab}>
				<Tab
					id="instructions"
					panel={
						<InstructionsTab
							submissionWorkflow={props.pubData.submission.submissionWorkflow}
						/>
					}
				/>
				<Tab
					id="submission"
					panel={
						<SubmissionTab
							abstract={abstract}
							onUpdatePub={updateAndSavePubData}
							onUpdateAbstract={updateAbstract}
							pub={props.pubData}
						/>
					}
				/>
				<Tab
					id="contributors"
					panel={
						<ContributorsTab
							pubData={props.pubData}
							onUpdatePub={updateAndSavePubData}
						/>
					}
				/>
				<Tab
					id="preview"
					panel={
						<PreviewTab
							updateHistoryData={updateHistoryData}
							historyData={props.historyData}
							pubData={props.pubData}
						/>
					}
				/>
			</Tabs>
		</PendingChangesProvider>
	);
};

export default SpubHeader;
