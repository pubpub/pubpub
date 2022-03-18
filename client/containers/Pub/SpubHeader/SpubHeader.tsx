import React, { useState } from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';

import { DocJson, PubHistoryState, PubPageData } from 'types';
import { assert } from 'utils/assert';
import { apiFetch } from 'client/utils/apiFetch';
import { getEmptyDoc } from 'components/Editor';
import { PendingChangesProvider } from 'components';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import ContributorsTab from './ContributorsTab';
import SpubHeaderToolBar from './SpubHeaderToolBar';

require('./spubHeader.scss');

type Props = {
	updateLocalData: (
		type: string,
		patch: Partial<PubPageData> | Partial<PubHistoryState>,
	) => unknown;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
};

export type SpubHeaderTab = 'instructions' | 'submission' | 'preview';

const SpubHeader = () => {
	const {
		updatePubData,
		updateLocalData,
		pubData,
		updateSubmissionState,
		submissionState,
		historyData,
	} = usePubContext();

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

	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return updateLocalData('history', newHistoryData);
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
			<Tabs id="spubHeaderPanels" className="header-panels" selectedTabId={selectedTab} onChange={(t) => setSelectedTab(t as any)} >
				<Tab
					id="instructions"
					panel={
						<InstructionsTab
							onBeginSubmission={() => setSelectedTab('submission')}
							submissionWorkflow={pubData.submission.submissionWorkflow!}
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
							pub={pubData}
						/>
					}
				/>
				<Tab
					id="contributors"
					panel={
						<ContributorsTab
							pubData={pubData}
							onUpdatePub={updateAndSavePubData}
						/>
					}
				/>
			</Tabs>
		</PendingChangesProvider>
	);
};

export default SpubHeader;
