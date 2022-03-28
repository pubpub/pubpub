import React, { useMemo, useRef } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { DocJson, PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { useSticky } from 'client/utils/useSticky';
import { PendingChangesProvider } from 'components';
import { usePendingChanges } from 'utils/hooks';

import { usePubContext } from '../pubHooks';
import PubHeaderSticky from '../PubHeader/PubHeaderSticky';
import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import ContributorsTab from './ContributorsTab';
import SpubHeaderToolBar from './SpubHeaderToolBar';
import { getPubHeadings } from '../PubHeader/headerUtils';

require('./spubHeader.scss');

export type SpubHeaderTab = 'instructions' | 'submission' | 'preview';

const SpubHeader = () => {
	const { pendingPromise } = usePendingChanges();
	const {
		updatePubData,
		pubData,
		collabData: { editorChangeObject },
		updateSubmissionState,
		submissionState,
	} = usePubContext();
	const { selectedTab, submission } = submissionState!;
	const headerRef = useRef<HTMLDivElement>(null);

	// TODO(ian): Move this computation to usePubBodyState()
	const pubHeadings = useMemo(
		() => getPubHeadings(pubData.initialDoc, editorChangeObject),
		[pubData.initialDoc, editorChangeObject],
	);

	useSticky({
		isActive: !!headerRef.current,
		target: '.spub-header-component',
		offset: headerRef?.current?.offsetHeight ? 37 - headerRef.current.offsetHeight : 0,
	});

	const updateAbstract = async (newAbstract: DocJson) => {
		updateSubmissionState(({ submission: currentSubmission }) => ({
			submission: {
				...currentSubmission,
				abstract: newAbstract,
			},
		}));
		return pendingPromise(
			apiFetch.put('/api/submissions', {
				abstract: newAbstract,
				id: submission.id,
			}),
		);
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		updatePubData(newPubData);
		return pendingPromise(
			apiFetch('/api/pubs', {
				method: 'PUT',
				body: JSON.stringify({
					...newPubData,
					pubId: pubData.id,
					communityId: pubData.communityId,
				}),
			}).catch(() => updatePubData(pubData)),
		);
	};

	const setSelectedTab = (nextTab: SpubHeaderTab) => {
		updateSubmissionState({ selectedTab: nextTab });
	};

	return (
		<div className="spub-header-component" ref={headerRef}>
			<div className="content-container">
				<SpubHeaderToolBar
					onSelectTab={(t: SpubHeaderTab) => setSelectedTab(t)}
					selectedTab={selectedTab}
					submission={submission}
				/>
				<Tabs id="spubHeaderPanels" selectedTabId={selectedTab}>
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
						panel={
							<ContributorsTab pubData={pubData} onUpdatePub={updateAndSavePubData} />
						}
					/>
					<Tab id="preview" />
				</Tabs>
			</div>
			<PubHeaderSticky pubData={pubData} pubHeadings={pubHeadings} />
		</div>
	);
};

export default () => (
	<PendingChangesProvider>
		<SpubHeader />
	</PendingChangesProvider>
);
