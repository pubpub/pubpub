import React, { useState } from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { DocJson, DefinitelyHas, PubHistoryState, PubPageData } from 'types';
import { assert } from 'utils/assert';
import { apiFetch } from 'client/utils/apiFetch';
import { getEmptyDoc } from 'components/Editor';

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

export const renderInstructionTabTitle = (icon: IconName, title: string) => {
	return (
		<>
			<Icon icon={icon} /> {title}
		</>
	);
};

const SpubHeader = (props: Props) => {
	const { pubData, historyData, updateLocalData } = props;
	const { submissionWorkflow } = props.pubData.submission;

	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	const [abstract, setAbstract] = useState(pubData.submission.abstract || getEmptyDoc());

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

	const instructionTabTitle = renderInstructionTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderInstructionTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderInstructionTabTitle('eye-open', 'Preview & Submit');

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
						pub={pubData}
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
						historyData={historyData}
						pubData={pubData}
					/>
				}
				className="tab preview-tab"
			/>
		</Tabs>
	);
};

export default SpubHeader;
