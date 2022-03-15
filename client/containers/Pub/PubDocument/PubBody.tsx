import React, { useContext, useState, useCallback } from 'react';
import { useBeforeUnload } from 'react-use';
import * as Sentry from '@sentry/browser';
import { useDebouncedCallback } from 'use-debounce/lib';

import { Editor } from 'components';
import discussionSchema from 'components/Editor/schemas/discussion';
import { EditorChangeObject } from 'client/components/Editor';

import { usePubContext } from '../pubHooks';
import { PubSuspendWhileTypingContext } from '../PubSuspendWhileTyping';
import { PubCollabStatus } from '../usePubCollabState';
import PubErrorAlert from './PubErrorAlert';

require('./pubBody.scss');

type Props = {
	editorWrapperRef: React.Ref<HTMLDivElement>;
};

const markSentryError = (err: Error) => {
	if (typeof window !== 'undefined' && (window as any).sentryIsActive) {
		Sentry.configureScope((scope) => scope.setTag('error_source', 'editor'));
		Sentry.captureException(err);
	}
};

const PubBody = (props: Props) => {
	const { editorWrapperRef } = props;
	const {
		noteManager,
		updateCollabData,
		updateHistoryData,
		pubData: { initialDocKey, nodeLabels },
		historyData: { isViewingHistory },
		collabData: { status, firebaseDraftRef, localCollabUser },
		pubBodyState: { key, initialContent, isReadOnly, includeCollabPlugin, discussionAnchors },
	} = usePubContext();
	const [editorErrorTime, setEditorErrorTime] = useState<number | null>(null);
	const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);
	const { markLastInput } = useContext(PubSuspendWhileTypingContext);

	useBeforeUnload(
		(status === 'saving' || status === 'disconnected') && !editorErrorTime,
		'Your Pub has changes that are still unsaved. Are you sure you wish to leave?',
	);

	const handleKeyPress = useCallback(() => {
		markLastInput();
		return false;
	}, [markLastInput]);

	const handleError = useCallback((err: Error) => {
		setEditorErrorTime(Date.now());
		markSentryError(err);
	}, []);

	const [handleStatusChange] = useDebouncedCallback((nextStatus: PubCollabStatus) => {
		if (nextStatus === 'saved') {
			setLastSavedTime(Date.now());
		}
		updateCollabData({ status: nextStatus });
	}, 250);

	const handleEditorChange = useCallback(
		(editorChangeObject: EditorChangeObject) => {
			updateCollabData({ editorChangeObject });
		},
		[updateCollabData],
	);

	const handleLatestKey = useCallback(
		(latestKey: number) => {
			updateHistoryData({ latestKey, currentKey: latestKey });
		},
		[updateHistoryData],
	);

	const collaborativeOptions = includeCollabPlugin &&
		!!firebaseDraftRef && {
			initialDocKey,
			firebaseRef: firebaseDraftRef,
			clientData: localCollabUser,
			onStatusChange: handleStatusChange,
			onUpdateLatestKey: handleLatestKey,
		};

	const discussionOptions = !isViewingHistory && {
		draftRef: firebaseDraftRef,
		initialHistoryKey: initialDocKey,
		discussionAnchors: discussionAnchors || [],
	};

	return (
		<main className="pub-body-component" ref={editorWrapperRef}>
			<Editor
				key={key}
				customNodes={discussionSchema}
				enableSuggestions
				nodeLabels={nodeLabels}
				noteManager={noteManager}
				placeholder={isReadOnly ? undefined : 'Begin writing here...'}
				initialContent={initialContent}
				isReadOnly={isReadOnly}
				onKeyPress={handleKeyPress}
				onChange={handleEditorChange}
				onError={handleError}
				discussionsOptions={discussionOptions}
				collaborativeOptions={collaborativeOptions}
			/>
			<PubErrorAlert
				pubErrorOccurredAt={editorErrorTime}
				lastSaveOccurredAt={lastSavedTime}
			/>
		</main>
	);
};

export default PubBody;
