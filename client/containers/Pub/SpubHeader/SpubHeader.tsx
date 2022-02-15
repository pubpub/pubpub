import React, { useState } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { DocJson } from 'types';
import { getEmptyDoc } from 'components/Editor';
import { apiFetch } from 'client/utils/apiFetch';
import { assert } from 'utils/assert';

import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';

require('./spubHeader.scss');

type Props = {
	updateLocalData: any;
	historyData: any;
	pubData: any;
};

export const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

const SpubHeader = (props: Props) => {
	const { pubData, updateLocalData } = props;
	const [abstract, setAbstract] = useState(pubData.submission.abstract || getEmptyDoc());
	const updateAbstract = async (newAbstract: DocJson) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				abstract: newAbstract,
				id: pubData.submission.id,
				status: pubData.submission.status,
			}),
		})
			.then(() => setAbstract(newAbstract))
			.catch((err) => console.log({ err }));
	};

	const updateAndSavePubData = (newPubData) => {
		const oldPubData = { ...pubData };
		updateLocalData('pub', newPubData, { isImmediate: true });
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: pubData.id,
				communityId: pubData.communityId,
			}),
		}).catch(() => updateLocalData('pub', oldPubData));
	};

	const updateHistoryData = (newHistoryData) => {
		return updateLocalData('history', newHistoryData);
	};

	const { submissionWorkflow } = props.pubData.submission;
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	assert(props.pubData.submission.submissionWorkflow !== undefined);

	const instructionTabTitle = renderTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderTabTitle('eye-open', 'Preview & Submit');

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
				panel={<InstructionsTab submissionWorkflow={submissionWorkflow} />}
				className="tab-panel tab"
			/>

			<Tab
				id="submission"
				title={submissionTabTitle}
				panel={
					<SubmissionTab
						abstract={abstract}
						onUpdatePub={updateAndSavePubData}
						onUpdateAbstract={updateAbstract}
						pub={props.pubData}
					/>
				}
				className="tab-panel tab"
			/>
			<Tab
				id="preview"
				title={previewTabTitle}
				panel={
					<PreviewTab
						updateHistoryData={updateHistoryData}
						historyData={props.historyData}
						pubData={props.pubData}
					/>
				}
				className="tab preview-tab"
			/>
		</Tabs>
	);
};

export default SpubHeader;
