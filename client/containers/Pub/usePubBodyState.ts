import { useMemo } from 'react';
import { DiscussionAnchor, DocJson } from 'types';
import { usePageContext } from 'utils/hooks';

import { PubContextType } from './PubContextProvider';

type Options = Pick<PubContextType, 'pubData' | 'submissionState' | 'collabData' | 'historyData'>;

export type PubBodyState = {
	initialContent: DocJson;
	includeCollabPlugin: boolean;
	isReadOnly: boolean;
	key: string | number;
	hidePubBody?: true;
	discussionAnchors?: DiscussionAnchor[];
};

export const usePubBodyState = (options: Options): PubBodyState => {
	const {
		pubData: { initialDoc, isInMaintenanceMode, isRelease, discussions },
		submissionState,
		historyData: { currentKey, isViewingHistory, historyDoc, historyDocKey },
		collabData: { firebaseDraftRef },
	} = options;
	const {
		scopeData: {
			activePermissions: { canEdit, canEditDraft },
		},
	} = usePageContext();

	const discussionAnchors = useMemo(() => {
		if (isRelease) {
			return discussions
				.map((discussion) =>
					discussion.anchors!.filter((anchor) => anchor.historyKey === currentKey),
				)
				.reduce((a, b) => [...a, ...b], []);
		}
		return [];
	}, [discussions, isRelease, currentKey]);

	const submissionPreviewDoc = submissionState?.submissionPreviewDoc;

	if (isInMaintenanceMode) {
		return {
			key: 'maintenance',
			isReadOnly: true,
			initialContent: initialDoc,
			includeCollabPlugin: false,
		};
	}

	if (isViewingHistory && historyDoc && historyDocKey) {
		return {
			key: historyDocKey,
			isReadOnly: true,
			initialContent: historyDoc,
			includeCollabPlugin: false,
		};
	}

	if (submissionPreviewDoc) {
		return {
			key: `submission-preview-${currentKey}`,
			isReadOnly: true,
			initialContent: submissionPreviewDoc,
			includeCollabPlugin: false,
			hidePubBody: true,
			discussionAnchors,
		};
	}

	return {
		key: firebaseDraftRef ? 'ready' : 'unready',
		isReadOnly: !(canEdit || canEditDraft),
		initialContent: initialDoc,
		includeCollabPlugin: !!firebaseDraftRef,
		discussionAnchors,
	};
};