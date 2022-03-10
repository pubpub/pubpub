import React, { useCallback, useRef } from 'react';

import { usePageContext } from 'utils/hooks';
import { NodeLabelMap } from 'client/components/Editor';
import { NoteManager } from 'client/utils/notes';
import { PatchFn, PubHistoryState, PubPageData } from 'types';

import { useLazyRef } from 'client/utils/useLazyRef';
import {
	PubSubmissionState,
	PubSubmissionStatePatchFn,
	usePubSubmissionState,
} from './usePubSubmissionState';
import { usePubCollabState, PubCollabState } from './usePubCollabState';
import { usePubHistoryState } from './usePubHistoryState';
import { useIdlyUpdatedState } from './useIdlyUpdatedState';
import { PubBodyState, usePubBodyState } from './usePubBodyState';

type Props = {
	children: React.ReactNode;
	pubData: PubPageData;
};

type UpdateLocalDataFn = (
	kind: 'pub' | 'collab' | 'history',
	data: any,
	options?: { isImmediate?: boolean },
) => void;

export type PubContextType = {
	inPub: boolean;
	pubData: PubPageData;
	pubBodyState: PubBodyState;
	updatePubData: PatchFn<PubPageData>;
	historyData: PubHistoryState;
	collabData: PubCollabState;
	submissionState: null | PubSubmissionState;
	updateSubmissionState: PubSubmissionStatePatchFn;
	updateLocalData: UpdateLocalDataFn;
	noteManager: NoteManager;
};

const shimPubContextProps = {
	inPub: false,
	pubData: {
		nodeLabels: {} as NodeLabelMap | undefined,
		slug: '',
		releases: [],
		releaseNumber: 0,
	},
	collabData: { editorChangeObject: {} },
	historyData: {},
	firebaseDraftRef: null,
	updateLocalData: null as any,
	updatePubData: null as any,
	submissionState: {},
	noteManager: new NoteManager('apa', 'count', {}),
} as any;

export const PubContext = React.createContext<PubContextType>(shimPubContextProps);

export const PubContextProvider = (props: Props) => {
	const { children, pubData: initialPubData } = props;
	const { locationData, communityData, loginData } = usePageContext();
	const [pubData, updatePubData] = useIdlyUpdatedState(initialPubData);
	const [collabData, updateCollabData] = usePubCollabState({ pubData });
	const [historyData, updateHistoryData] = usePubHistoryState({ pubData });
	const [submissionState, updateSubmissionState] = usePubSubmissionState({
		pubData,
		editorChangeObject: collabData.editorChangeObject,
	});
	const pubBodyState = usePubBodyState({ pubData, collabData, historyData, submissionState });
	const { current: noteManager } = useLazyRef(
		() =>
			new NoteManager(
				pubData.citationStyle,
				pubData.citationInlineStyle,
				pubData.initialStructuredCitations,
			),
	);

	const updateLocalData: UpdateLocalDataFn = useCallback(
		(kind, data, options = {}) => {
			const { isImmediate } = options;
			if (kind === 'pub') {
				if (isImmediate) {
					updatePubData.immediately(true)(data);
				} else {
					updatePubData(data);
				}
			}
			if (kind === 'collab') {
				updateCollabData(data);
			}
			if (kind === 'history') {
				updateHistoryData(data);
			}
		},
		[updatePubData, updateCollabData, updateHistoryData],
	);

	const pubContext: PubContextType = {
		inPub: true,
		pubData,
		updatePubData,
		collabData,
		historyData,
		submissionState,
		updateSubmissionState,
		noteManager,
		pubBodyState,
		updateLocalData,
	};

	return <PubContext.Provider value={pubContext}>{children}</PubContext.Provider>;
};
