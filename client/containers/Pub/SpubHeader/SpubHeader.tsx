import React, { useEffect, useState } from 'react';
import { TabId } from '@blueprintjs/core';

import { DocJson, DefinitelyHas, PubHistoryState, PubPageData } from 'types';
import { assert } from 'utils/assert';
import { apiFetch } from 'client/utils/apiFetch';
import { getEmptyDoc } from 'components/Editor';

import { usePubContext } from '../pubHooks';

import SpubHeaderToolbar from './SpubHeaderToolBar/SpubHeaderToolbar';

require('./spubHeader.scss');

type Props = {
	historyData: PubHistoryState;
	updateLocalData: (
		type: string,
		patch: Partial<PubPageData> | Partial<PubHistoryState>,
	) => unknown;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
};

const SpubHeader = (props: Props) => {
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	const [abstract, setAbstract] = useState(
		() => props.pubData.submission.abstract || getEmptyDoc(),
	);
	const { updatePubData } = usePubContext();

	const updateAbstract = async (newAbstract: DocJson) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				abstract: newAbstract,
				id: props.pubData.submission.id,
			}),
		}).then(() => setAbstract(newAbstract));
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		props.updateLocalData('pub', newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: props.pubData.id,
				communityId: props.pubData.communityId,
			}),
		}).catch(() => props.updateLocalData('pub', props.pubData));
	};
	assert(props.pubData.submission.submissionWorkflow !== undefined);
	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return props.updateLocalData('history', newHistoryData);
	};

	useEffect(() => {
		if (updatePubData) {
			updatePubData({ isReadOnly: selectedTab === 'preview' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTab]);

	return (
		<>
			<SpubHeaderToolbar
				selectedTab={selectedTab}
				onSelectTab={setSelectedTab}
				submissionWorkflow={props.pubData.submission.submissionWorkflow}
				pubData={props.pubData}
				abstract={abstract}
				onUpdatePub={updateAndSavePubData}
				onUpdateAbstract={updateAbstract}
				updateHistoryData={updateHistoryData}
				historyData={props.historyData}
			/>
		</>
	);
};

export default SpubHeader;
