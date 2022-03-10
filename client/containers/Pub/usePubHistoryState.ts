import { useCallback, useEffect } from 'react';
import queryString from 'query-string';

import { PatchFnArg, PubHistoryState, PubPageData, PubDraftInfo } from 'types';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';

import { useIdlyUpdatedState } from './useIdlyUpdatedState';

type Options = {
	pubData: PubPageData;
};

type HistoryStateUpdate = Pick<PubHistoryState, 'currentKey' | 'latestKey' | 'isViewingHistory'>;

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

	const updateCertainHistoryState = useCallback(
		(next: PatchFnArg<HistoryStateUpdate>) => {
			updateHistoryState(next);
		},
		[updateHistoryState],
	);

	useEffect(() => {
		if (latestKey >= 0) {
			updateHistoryState((state) => {
				return {
					timestamps: {
						...state.timestamps,
						[latestKey]: Date.now(),
					},
				};
			});
		}
	}, [latestKey, updateHistoryState]);

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

	return [historyState, updateCertainHistoryState] as const;
};
