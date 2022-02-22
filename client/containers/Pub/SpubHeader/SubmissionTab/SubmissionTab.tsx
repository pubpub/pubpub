import React, { useState } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { PubPageData, DefinitelyHas, DocJson } from 'types';

import TitleDescriptionAbstract from './TitleDescriptionAbstract';
import Contributors from './Contributors';
import SpubSettings from './SpubSettings';

type Props = {
	pub: DefinitelyHas<PubPageData, 'submission'>;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
};

const SubmissionTab = (props: Props) => {
	const { onUpdatePub, onUpdateAbstract, pub, abstract } = props;
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
					panel={
						<TitleDescriptionAbstract
							pub={pub}
							abstract={abstract}
							onUpdatePub={onUpdatePub}
							onUpdateAbstract={onUpdateAbstract}
						/>
					}
				/>
				<Tab
					id="contributors"
					title="Contributors"
					panel={<Contributors pubData={pub} onUpdatePub={onUpdatePub} />}
				/>
				<Tab
					id="spubsettings"
					title="Pub Settings"
					panel={<SpubSettings pubData={pub} onUpdatePub={onUpdatePub} />}
				/>
			</Tabs>
		</div>
	);
};

export default SubmissionTab;
