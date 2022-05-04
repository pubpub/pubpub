import { useCallback, useEffect } from 'react';
import queryString from 'query-string';

import { PubHistoryState, PubPageData, PubDraftInfo } from 'types';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';

import { useIdlyUpdatedState } from './useIdlyUpdatedState';

type Options = {
	pubData: PubPageData;
};

const loadPubVersionFromHistory = (
	pubId: string,
	historyKey: number,
	accessHash: string,
): Promise<PubDraftInfo> =>
	apiFetch.get(
		'/api/pubHistory?' +
			queryString.stringify({
				pubId,
				historyKey,
				accessHash,
			}),
	);

export const usePubHistoryState = (options: Options) => {
	const { pubData } = options;
	const {
		locationData: {
			query: { access: accessHash },
		},
	} = usePageContext();

	const [historyState, updateHistoryState] = useIdlyUpdatedState<PubHistoryState>(() => {
		const { historyData } = pubData;
		const isViewingHistory = historyData.currentKey !== historyData.latestKey;
		return {
			...historyData,
			timestamps: {
				[-1]: new Date(pubData.createdAt).valueOf(),
				...historyData.timestamps,
			},
			outstandingRequests: 0,
			latestKeyReceivedAt: null,
			isViewingHistory,
			loadedIntoHistory: isViewingHistory,
			historyDocKey: `history-${historyData.currentKey}`,
			historyDoc: isViewingHistory ? pubData.initialDoc : null,
		};
	});

	const pubId = pubData.id;
	const { latestKey, currentKey } = historyState;

	const setLatestHistoryKey = useCallback(
		(key: number) =>
			updateHistoryState((currentState) => {
				return {
					currentKey: key,
					latestKey: key,
					timestamps: {
						[key]: Date.now(),
						...currentState.timestamps,
					},
				};
			}),
		[updateHistoryState],
	);

	const setCurrentHistoryKey = useCallback(
		(key: number) => updateHistoryState({ currentKey: key }),
		[updateHistoryState],
	);

	const setIsViewingHistory = useCallback(
		(value: boolean) => updateHistoryState({ isViewingHistory: value }),
		[updateHistoryState],
	);

	useEffect(() => {
		const isCurrentDocHistorical = currentKey < latestKey;
		if (isCurrentDocHistorical) {
			updateHistoryState((state) => {
				return {
					outstandingRequests: state.outstandingRequests + 1,
				};
			});
			loadPubVersionFromHistory(pubId, currentKey, accessHash).then((draftInfo) => {
				const {
					doc,
					historyData: { timestamps },
				} = draftInfo;
				updateHistoryState((state) => {
					const outstandingRequestsUpdate = {
						outstandingRequests: state.outstandingRequests - 1,
					};
					if (state.currentKey === currentKey) {
						return {
							...outstandingRequestsUpdate,
							historyDoc: doc,
							historyDocKey: `history-${currentKey}`,
							timestamps: {
								...state.timestamps,
								...timestamps,
							},
						};
					}
					return outstandingRequestsUpdate;
				});
			});
		}
	}, [currentKey, latestKey, accessHash, pubId, updateHistoryState]);

	return {
		...historyState,
		setCurrentHistoryKey,
		setLatestHistoryKey,
		setIsViewingHistory,
	};
};
