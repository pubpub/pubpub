import React, { useState } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { getEmptyDoc } from 'components/Editor';
import { apiFetch } from 'client/utils/apiFetch';
import { DocJson, DefinitelyHas, PubHistoryState, PubPageData } from 'types';
import { assert } from 'utils/assert';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';

require('./spubHeader.scss');

type Props = {
	historyData: PubHistoryState;
	updateLocalData: (
		type: string,
		patch: Partial<PubPageData> | Partial<PubHistoryState>,
	) => unknown;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
};

export const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

const SpubHeader = (props: Props) => {
	const { pubData, updateLocalData } = props;
	const [abstract, setAbstract] = useState(pubData.submission.abstract || getEmptyDoc());
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	const updateAbstract = async (newAbstract: DocJson) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				abstract: newAbstract,
				id: pubData.submission.id,
				status: pubData.submission.status,
			}),
		}).then(() => setAbstract(newAbstract));
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		const oldPubData = { ...pubData };
		updateLocalData('pub', newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: pubData.id,
				communityId: pubData.communityId,
			}),
		}).catch(() => updateLocalData('pub', oldPubData));
	};
	assert(props.pubData.submission.submissionWorkflow !== undefined);

	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return updateLocalData('history', newHistoryData);
	};
	const instructionTabTitle = renderTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderTabTitle('eye-open', 'Preview & Submit');

	const maybeActiveClass = (tabId) => `${tabId === selectedTab ? 'active' : 'inactive'}`;

	return (
		<Tabs
			id="spubHeader"
			onChange={(t) => setSelectedTab(t)}
			selectedTabId={selectedTab}
			className="spub-header-component tabs bp3-large"
		>
			<Tab
				id="instructions"
				title={instructionTabTitle}
				className={`tab-panel ${maybeActiveClass('instructions')}`}
				panel={
					<InstructionsTab
						submissionWorkflow={props.pubData.submission.submissionWorkflow}
					/>
				}
			/>

			<Tab
				id="submission"
				title={submissionTabTitle}
				className={`tab-panel ${maybeActiveClass('submission')}`}
				panel={
					<SubmissionTab
						abstract={abstract}
						onUpdatePub={updateAndSavePubData}
						onUpdateAbstract={updateAbstract}
						pub={props.pubData}
					/>
				}
			/>
			<Tab
				id="preview"
				title={previewTabTitle}
				className={`${maybeActiveClass('preview')}`}
				panel={
					<PreviewTab
						updateHistoryData={updateHistoryData}
						historyData={props.historyData}
						pubData={props.pubData}
					/>
				}
			/>
		</Tabs>
	);
};

export default SpubHeader;
