import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { PubPageData } from 'types';

import TitleDescriptionAbstract from './TitleDescriptionAbstract';
import Contributors from './Contributors';
import SpubSettings from './SpubSettings';

type Props = {
	pubData: PubPageData;
};

const SubmissionTab = (props: Props) => {
	const { pubData } = props;
	const [selectedTab, setSelectedTab] = useState('title');

	return (
		<div>
			<Tabs
				id="TabsExample"
				className="submission-tab-tabs"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
				onChange={setSelectedTab}
				selectedTabId={selectedTab}
			>
				<Tab
					id="title"
					title="Title, Description & Abstract"
					panel={<TitleDescriptionAbstract pubData={pubData} />}
				/>
				<Tab id="contributors" title="Contributors" panel={<Contributors />} />
				<Tab id="spubsettings" title="Pub Settings" panel={<SpubSettings />} />
			</Tabs>
		</div>
	);
};

export default SubmissionTab;
