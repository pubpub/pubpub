import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import TitleDescriptionAbstract from './TitleDescriptionAbstract';

require('./spubHeader.scss');

const SubmissionTab = () => {
	const [selectedTab, setSelectedTab] = useState('instructions');

	return (
		<>
			<Tabs
				id="TabsExample"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
				onChange={setSelectedTab}
				selectedTabId={selectedTab}
				className="bp3-large"
			>
				<Tab
					id="instructions"
					title="Title, Description & Abstract"
					panel={<TitleDescriptionAbstract />}
				/>
				<Tab id="submission" title="Contributors" panel={<>Here we goooooo</>} />
				<Tab id="preview" title="Pub Settings" panel={<>Disney movies are under rated</>} />
			</Tabs>
		</>
	);
};

export default SubmissionTab;
