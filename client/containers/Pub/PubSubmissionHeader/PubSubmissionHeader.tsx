import React, { useState } from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';

import { SubmissionWorkflow } from 'types';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';
import { renderInstructionTabTitle } from './utility';

require('./spubHeader.scss');

type Props = {
	workflow: Pick<SubmissionWorkflow, 'instructionsText'>;
};

const PubSubmissionHeader = (props: Props) => {
	const { workflow } = props;
	const { instructionsText } = workflow;
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');

	const instructions = renderInstructionTabTitle('align-left', 'Instructions');
	const submission = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const preview = renderInstructionTabTitle('eye-open', 'Preview & Edit');

	return (
		<div className="spub-header-component">
			<Tabs
				id="TabsExample"
				onChange={(t) => setSelectedTab(t)}
				selectedTabId={selectedTab}
				className="tabs bp3-large"
			>
				<Tab
					id="instructions"
					title={instructions}
					panel={<InstructionsTab instructions={instructionsText} />}
				/>

				<Tab id="submission" title={submission} panel={<SubmissionTab />} />
				<Tab id="preview" title={preview} panel={<PreviewTab />} />
			</Tabs>
		</div>
	);
};

export default PubSubmissionHeader;
