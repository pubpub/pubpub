import React, { Dispatch, SetStateAction } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { GridWrapper } from 'components';

const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

type Props = {
	selectedTab: TabId;
	onSelectTab: Dispatch<SetStateAction<TabId>>;
};

const SpubHeaderToolbar = (props: Props) => {
	const instructionTabTitle = renderTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderTabTitle('manually-entered-data', 'Submission');
	const contributorsTabTitle = renderTabTitle('people', 'Contributors');
	const previewTabTitle = renderTabTitle('eye-open', 'Preview & Submit');
	const maybeActiveClass = (tabId: string) =>
		`${tabId === props.selectedTab ? 'active' : 'inactive'}`;

	return (
		<GridWrapper>
			<Tabs
				id="spubHeader"
				onChange={props.onSelectTab}
				selectedTabId={props.selectedTab}
				className="spub-header-component tabs bp3-large"
			>
				<Tab
					id="instructions"
					title={instructionTabTitle}
					className={`tab-panel ${maybeActiveClass('instructions')}`}
				/>

				<Tab
					id="submission"
					title={submissionTabTitle}
					className={`tab-panel ${maybeActiveClass('submission')}`}
				/>

				<Tab
					id="contributors"
					title={contributorsTabTitle}
					className={`tab-panel ${maybeActiveClass('contributors')}`}
				/>
				<Tab
					id="preview"
					title={previewTabTitle}
					className={`${maybeActiveClass('preview')}`}
				/>
			</Tabs>
		</GridWrapper>
	);
};

export default SpubHeaderToolbar;
