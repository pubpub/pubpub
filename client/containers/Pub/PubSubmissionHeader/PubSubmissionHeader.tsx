import React, { useState } from 'react';
import { Tab, Tabs, Icon, IconName } from '@blueprintjs/core';

import { DocJson } from 'types';

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
	const instructionNode: DocJson = {
		type: 'doc',
		attrs: 'What Is This',
		content: [
			<>
				<h1>This is the Title for Submissions Set by the Person Calling for Submissions</h1>
				<br />
				<br />
				<p>
					You gotta do a little dance to get into a pocket dimension. You know, like in
					Fringe. First go to the building from the tape, go to apartment 413, its
					dangerous though. careful footing. In the middle of the room walk three steps
					forwad, step to the left. step to the right, walk backwards three steps, step
					left, turn left 270 degrees. step forward
				</p>
				<br />
				<li>One</li>
				<li>Two</li>
				<li>Three</li>
				<li>Onto</li>
				<li>Four</li>
				<br />
				<br />
				<p>
					If you have any questions, you can email the community admin at
					hello@institution.com, and could even contain a story about civiizations that
					have come and gone in the time it takes for a species to evolve past its own
					technological limtations. Do we really know what exists around us? There are
					phenomena that exists outside the visible spectrum which we may have no clear
					perception of.{' '}
				</p>
				Alll above will be be forgetten, and what is left?
			</>,
		],
	};

	return (
		<div className="pub-header-component">
			<Tabs
				id="TabsExample"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
				onChange={setSelectedTab}
				selectedTabId={selectedTab}
			>
				<Tab
					id="instructions"
					title={instructions}
					panel={<InstructionTab instructions={instructionNode} />}
				/>
				<Tab id="submission" title={submission} panel={<SubmissionTab />} />
				<Tab id="preview" title={preview} panel={<PreviewTab />} />
			</Tabs>
		</div>
	);
};

export default PubSubmissionHeader;
