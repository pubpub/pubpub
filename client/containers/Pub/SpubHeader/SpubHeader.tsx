import React, { useState } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { Submission, Pub } from 'types';
import { assert } from 'utils/assert';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';
``;

require('./spubHeader.scss');

type Props = {
	updateLocalData: any;
	historyData: any;
	pubData: any;
	onUpdatePub?: (pub: Partial<Pub>) => unknown;
	onUpdateSubmission?: (submission: Partial<Submission>) => unknown;
};

export const renderInstructionTabTitle = (icon: IconName, title: string) => {
	return (
		<>
			<Icon icon={icon} /> {title}
		</>
	);
};

const SpubHeader = (props: Props) => {
	const { submissionWorkflow, onUpdatePub, onUpdateSubmission } = props.pubData.submission;
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	assert(props.pubData.submission.submissionWorkflow !== undefined);

	const instructionTabTitle = renderInstructionTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderInstructionTabTitle('eye-open', 'Preview & Submit');
	const updateHistoryData = (newHistoryData) => {
		return props.updateLocalData('history', newHistoryData);
	};

	return (
		<Tabs
			id="spubHeader"
			onChange={(t) => setSelectedTab(t)}
			selectedTabId={selectedTab}
			className="spub-header-component tabs bp3-large"
		>
			<Tab
				id="instructions"
				title={instructionTabTitle}
				panel={<InstructionsTab submissionWorkflow={submissionWorkflow} />}
				className="tab-panel tab"
			/>

			<Tab
				id="submission"
				title={submissionTabTitle}
				panel={
					<SubmissionTab
						onUpdatePub={onUpdatePub}
						onUpdateSubmission={onUpdateSubmission}
					/>
				}
				className="tab-panel tab"
			/>
			<Tab
				id="preview"
				title={previewTabTitle}
				panel={
					<PreviewTab
						updateHistoryData={updateHistoryData}
						historyData={props.historyData}
						pubData={props.pubData}
					/>
				}
				className="tab preview-tab"
			/>
		</Tabs>
	);
};

export default SpubHeader;
