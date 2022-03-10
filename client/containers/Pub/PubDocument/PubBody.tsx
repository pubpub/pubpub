import React, { useRef, useContext, useState, useCallback, useMemo } from 'react';
import { useBeforeUnload } from 'react-use';
import * as Sentry from '@sentry/browser';
import { debounce } from 'debounce';

import { Editor } from 'components';
import { usePageContext } from 'utils/hooks';
import discussionSchema from 'components/Editor/schemas/discussion';

import { PubSuspendWhileTypingContext } from '../PubSuspendWhileTyping';
import { usePubContext } from '../pubHooks';
import PubErrorAlert from './PubErrorAlert';

require('./pubBody.scss');

type Props = {
	editorWrapperRef: React.Ref<HTMLDivElement>;
};

let setSavingTimeout;

const PubBody = (props: Props) => {
	const { editorWrapperRef } = props;
	const { communityData } = usePageContext();
	const { pubData, noteManager, updateLocalData, collabData, historyData, pubBodyState } =
		usePubContext();
	const { firebaseDraftRef } = collabData;
	const { isViewingHistory } = historyData;
	const { key, initialContent, isReadOnly, includeCollabPlugin } = pubBodyState;
	const prevStatusRef = useRef<string | null>(null);
	const [editorErrorTime, setEditorErrorTime] = useState<number | null>(null);
	const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);

	prevStatusRef.current = collabData.status;
	useBeforeUnload(
		(collabData.status === 'saving' || collabData.status === 'disconnected') &&
			!editorErrorTime,
		'Your pub has not finished saving. Are you sure you wish to leave?',
	);

	const getNextStatus = (status, onComplete) => {
		clearTimeout(setSavingTimeout);
		const prevStatus = prevStatusRef.current;
		const nextStatus = { status };

		/* If loading, wait until 'connected' */
		if (prevStatus === 'connecting' && status === 'connected') {
			onComplete(nextStatus);
		}

		if (prevStatus !== 'connecting' && prevStatus !== 'disconnected') {
			if (status === 'saving') {
				setSavingTimeout = setTimeout(() => {
					onComplete(nextStatus);
				}, 250);
			} else {
				onComplete(nextStatus);
				setLastSavedTime(Date.now());
			}
		}

		/* If disconnected, only set state if the new status is 'connected' */
		if (prevStatus === 'disconnected' && status === 'connected') {
			onComplete(nextStatus);
		}
	};
	const { markLastInput } = useContext(PubSuspendWhileTypingContext);
	const discussionAnchors = useMemo(() => {
		if (pubData.isRelease) {
			return pubData.discussions
				.map((discussion) =>
					discussion.anchors!.filter(
						(anchor) => anchor.historyKey === historyData.currentKey,
					),
				)
				.reduce((a, b) => [...a, ...b], []);
		}
		return [];
	}, [pubData.discussions, pubData.isRelease, historyData.currentKey]);

	const handleKeyPress = useCallback(() => {
		markLastInput();
		return false;
	}, [markLastInput]);

	const handleError = useCallback((err) => {
		setEditorErrorTime(Date.now());
		if (typeof window !== 'undefined' && (window as any).sentryIsActive) {
			Sentry.configureScope((scope) => {
				scope.setTag('error_source', 'editor');
			});
			Sentry.captureException(err);
		}
	}, []);

	return (
		<main className="pub-body-component" ref={editorWrapperRef}>
			<style>
				{`
					.editor.ProseMirror h1#abstract:first-child {
						color: ${communityData.accentColorDark};
					}
				`}
			</style>
			<Editor
				key={key}
				customNodes={discussionSchema}
				enableSuggestions
				nodeLabels={pubData.nodeLabels}
				noteManager={noteManager}
				placeholder={isReadOnly ? undefined : 'Begin writing here...'}
				initialContent={initialContent}
				isReadOnly={isReadOnly}
				onKeyPress={handleKeyPress}
				onChange={(editorChangeObject) => {
					if (!isViewingHistory) {
						updateLocalData('collab', { editorChangeObject });
					}
				}}
				onError={handleError}
				discussionsOptions={
					!isViewingHistory && {
						draftRef: firebaseDraftRef,
						initialHistoryKey: pubData.initialDocKey,
						discussionAnchors,
					}
				}
				collaborativeOptions={
					includeCollabPlugin && firebaseDraftRef
						? {
								firebaseRef: firebaseDraftRef,
								clientData: collabData.localCollabUser,
								initialDocKey: pubData.initialDocKey,
								onStatusChange: debounce((status) => {
									getNextStatus(status, (nextStatus) => {
										updateLocalData('collab', nextStatus);
									});
								}, 250),
								onUpdateLatestKey: (latestKey) => {
									updateLocalData('history', {
										latestKey,
										currentKey: latestKey,
									});
								},
						  }
						: undefined
				}
			/>
			<PubErrorAlert
				pubErrorOccurredAt={editorErrorTime}
				lastSaveOccurredAt={lastSavedTime}
			/>
		</main>
	);
};

export default PubBody;
