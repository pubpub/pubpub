import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { SubmissionStatus, DocJson, PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { PendingChangesProvider } from 'components';

import { usePubContext } from '../pubHooks';
import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import ContributorsTab from './ContributorsTab';
import SpubHeaderToolBar from './SpubHeaderToolBar';

require('./spubHeader.scss');

export type SpubHeaderTab = 'instructions' | 'submission' | 'preview';

const SpubHeader = () => {
	const { updatePubData, pubData, updateSubmissionState, submissionState } = usePubContext();

	const { selectedTab, submission } = submissionState!;

	const updateAbstract = async (newAbstract: DocJson) => {
		updateSubmissionState(({ submission: currentSubmission }) => ({
			submission: {
				...currentSubmission,
				abstract: newAbstract,
			},
		}));
		return apiFetch.put('/api/submissions', {
			abstract: newAbstract,
			id: submission.id,
		});
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		updatePubData(newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: pubData.id,
				communityId: pubData.communityId,
			}),
		}).catch(() => updatePubData(pubData));
	};

	const setSelectedTab = (nextTab: SpubHeaderTab) => {
		updateSubmissionState({ selectedTab: nextTab });
	};

	return (
		<PendingChangesProvider>
			<SpubHeaderToolBar
				onSelectTab={(t: SpubHeaderTab) => setSelectedTab(t)}
				selectedTab={selectedTab}
				showSubmitButton={true}
				onSubmit={() => {}}
				status={submission.status as SubmissionStatus}
			/>
			<Tabs
				id="spubHeaderPanels"
				className="header-panels"
				selectedTabId={selectedTab}
				onChange={(t) => setSelectedTab(t as SpubHeaderTab)}
			>
				<Tab
					id="instructions"
					panel={
						<InstructionsTab
							onBeginSubmission={() => setSelectedTab('submission')}
							submissionWorkflow={submission.submissionWorkflow!}
						/>
					}
				/>
				<Tab
					id="submission"
					panel={
						<SubmissionTab
							abstract={submission.abstract}
							onUpdatePub={updateAndSavePubData}
							onUpdateAbstract={updateAbstract}
							pub={pubData}
						/>
					}
				/>
				<Tab
					id="contributors"
					panel={<ContributorsTab pubData={pubData} onUpdatePub={updateAndSavePubData} />}
				/>
			</Tabs>
		</PendingChangesProvider>
	);
};

export default SpubHeader;
