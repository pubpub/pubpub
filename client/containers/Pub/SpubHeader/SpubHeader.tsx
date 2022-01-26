import React, { useState } from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';

import { GridWrapper } from 'components';

import { SubmissionWorkflow } from 'types';
import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab/SubmissionTab';
import PreviewTab from './PreviewTab';
import { renderInstructionTabTitle } from './utility';

require('./spubHeader.scss');

type Props = {
	workflow: SubmissionWorkflow;
};

const SpubHeader = (props: Props) => {
	const { workflow } = props;
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	const { instructionsText } = workflow;

	const instructions = renderInstructionTabTitle('align-left', 'Instructions');
	const submission = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const preview = renderInstructionTabTitle('eye-open', 'Preview & Submit');

	return (
		<div className="spub-header-component">
			<GridWrapper containerClassName="pub" columnClassName="spub-header-column">
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
						className="tab-panel tab"
					/>

					<Tab
						id="submission"
						title={submission}
						panel={<SubmissionTab />}
						className="tab-panel tab"
					/>
					<Tab
						id="preview"
						title={preview}
						panel={<PreviewTab />}
						className="tab-panel tab"
					/>
				</Tabs>
			</GridWrapper>
		</div>
	);
};

export default SpubHeader;
