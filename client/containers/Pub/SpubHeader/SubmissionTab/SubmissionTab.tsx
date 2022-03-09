import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { PubPageData, DefinitelyHas, DocJson } from 'types';

import SpubSettings from './SpubSettings';

type Props = {
	pub: DefinitelyHas<PubPageData, 'submission'>;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
};

const SubmissionTab = (props: Props) => {
	const [selectedTab, setSelectedTab] = useState('title-description-abstract');
	const maybeActiveClass = (tabId: string) => `${tabId === selectedTab ? 'active' : 'inactive'}`;

	return (
		<Tabs
			className="submission-tab-component"
			// @ts-expect-error ts-migrate(2322) FIXME: Type 'Dispatch<SetStateAction<string>>' is not ass... Remove this comment to see the full error message
			onChange={setSelectedTab}
			selectedTabId={selectedTab}
		>
			<Tab
				className={maybeActiveClass('spubSettings')}
				id="spubSettings"
				title="Pub Settings"
				panel={<SpubSettings pubData={props.pub} onUpdatePub={props.onUpdatePub} />}
			/>
		</Tabs>
	);
};

export default SubmissionTab;
