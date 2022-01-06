import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import InstructionTab from './InstructionTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';
// import { Icon } from 'components';
// type Props = {};

const PubSubmissionHeader = () => {
	const [selectedTab, setSelectedTab] = useState('instructions');

	return (
		<>
			<Tabs
				id="TabsExample"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
				onChange={setSelectedTab}
				selectedTabId={selectedTab}
			>
				<Tab id="instructions" title="Instructions" panel={<InstructionTab />} />
				<Tab
					id="submission"
					title="Submssion"
					panel={<SubmissionTab />}
					panelClassName="ember-panel"
				/>
				<Tab id="preview" title="Preview & Submit" panel={<PreviewTab />} />
			</Tabs>
		</>
	);
};

export default PubSubmissionHeader;
