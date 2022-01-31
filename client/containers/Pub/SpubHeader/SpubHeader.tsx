import React, { useState } from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';
import { renderInstructionTabTitle } from './utility';

require('./spubHeader.scss');

type Props = {
	pubData: any;
};

const SpubHeader = (props: Props) => {
	const { submissionWorkflow } = props.pubData.submission || {};
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	if (!submissionWorkflow) return null;
	const { instructionsText } = submissionWorkflow;

	const instructions = renderInstructionTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const preview = renderInstructionTabTitle('eye-open', 'Preview & Submit');

	return (
		<Tabs
			id="TabsExample"
			onChange={(t) => setSelectedTab(t)}
			selectedTabId={selectedTab}
			className="spub-header-component tabs bp3-large"
		>
			<Tab
				id="instructions"
				title={instructions}
				panel={<InstructionsTab instructions={instructionsText} />}
				className="tab-panel tab"
			/>

			<Tab
				id="submission"
				title={submissionTabTitle}
				panel={<SubmissionTab />}
				className="tab-panel tab"
			/>
			<Tab
				id="preview"
				title={preview}
				panel={<PreviewTab pubData={props.pubData} />}
				className="tab-panel tab"
			/>
		</Tabs>
	);
};

export default SpubHeader;
