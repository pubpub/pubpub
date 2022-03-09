import React, { Dispatch, SetStateAction } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { GridWrapper } from 'components';
import { DefinitelyHas, DocJson, PubHistoryState, PubPageData, SubmissionWorkflow } from 'types';
import { assert } from 'utils/assert';

import InstructionsTab from '../InstructionsTab';
import SubmissionTab from '../SubmissionTab';
import PreviewTab from '../PreviewTab';

const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

type Props = {
	selectedTab: TabId;
	onSelectTab: Dispatch<SetStateAction<TabId>>;
	submissionWorkflow: SubmissionWorkflow;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
	updateHistoryData: (patch: Partial<PubHistoryState>) => unknown;
	historyData: PubHistoryState;
};

const SpubHeaderToolbar = (props: Props) => {
	assert(props.pubData.submission.submissionWorkflow !== undefined);

	const instructionTabTitle = renderTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderTabTitle('eye-open', 'Preview & Submit');
	const maybeActiveClass = (tabId: string) =>
		`${tabId === props.selectedTab ? 'active' : 'inactive'}`;

	return (
		<GridWrapper>
			{' '}
			<Tabs
				id="spubHeader"
				onChange={props.onSelectTab}
				selectedTabId={props.selectedTab}
				className="spub-header-component tabs bp3-large"
			>
				<Tab
					id="instructions"
					title={instructionTabTitle}
					className={`tab-panel ${maybeActiveClass('instructions')}`}
					panel={
						<InstructionsTab
							submissionWorkflow={props.pubData.submission.submissionWorkflow}
						/>
					}
				/>

				<Tab
					id="submission"
					title={submissionTabTitle}
					className={`tab-panel ${maybeActiveClass('submission')}`}
					panel={
						<SubmissionTab
							abstract={props.abstract}
							onUpdatePub={props.onUpdatePub}
							onUpdateAbstract={props.onUpdateAbstract}
							pubData={props.pubData}
						/>
					}
				/>
				<Tab
					id="preview"
					title={previewTabTitle}
					className={`${maybeActiveClass('preview')}`}
					panel={
						<PreviewTab
							updateHistoryData={props.updateHistoryData}
							historyData={props.historyData}
							pubData={props.pubData}
						/>
					}
				/>
			</Tabs>
		</GridWrapper>
	);
};

export default SpubHeaderToolbar;
