import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import TitleDescriptionAbstract from './TitleDescriptionAbstract';
import Contributors from './Contributors';
import SpubSettings from './SpubSettings';

require('./spubHeader.scss');

const SubmissionTab = () => {
	const [selectedTab, setSelectedTab] = useState('title');

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
					id="title"
					title="Title, Description & Abstract"
					panel={<TitleDescriptionAbstract />}
				/>
				<Tab id="contributors" title="Contributors" panel={<Contributors />} />
				<Tab id="spubsettings" title="Pub Settings" panel={<SpubSettings />} />
			</Tabs>
		</>
	);
};

export default SubmissionTab;
