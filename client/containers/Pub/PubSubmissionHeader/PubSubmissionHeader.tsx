import React, { useState } from 'react';
import { Tab, Tabs, Icon, IconName } from '@blueprintjs/core';

import InstructionTab from './InstructionTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';

require('./spubHeader.scss');

const PubSubmissionHeader = () => {
	const [selectedTab, setSelectedTab] = useState('instructions');

	const renderInstructionTabTitle = (icon: IconName, title: string) => {
		return (
			<>
				<Icon icon={icon} /> {title}
			</>
		);
	};

	const instructions = renderInstructionTabTitle('align-left', 'Instructions');
	const submission = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const preview = renderInstructionTabTitle('eye-open', 'Preview & Edit');

	return (
		<div className="pub-header-component">
			<Tabs
				id="TabsExample"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
				onChange={setSelectedTab}
				selectedTabId={selectedTab}
			>
				<Tab id="instructions" title={instructions} panel={<InstructionTab />} />
				<Tab
					id="submission"
					title={submission}
					panel={<SubmissionTab />}
					panelClassName="ember-panel"
				/>
				<Tab id="preview" title={preview} panel={<PreviewTab />} />
			</Tabs>
		</div>
	);
};

export default PubSubmissionHeader;
