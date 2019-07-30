import React, { useRef, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { useBeforeUnload } from 'react-use';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { Card, Alert } from '@blueprintjs/core';
import Editor from '@pubpub/editor';
import { getResizedUrl } from 'utils';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import { PubSuspendWhileTypingContext } from '../PubSuspendWhileTyping';

import discussionSchema from './DiscussionAddon/discussionSchema';
import { nestDiscussionsToThreads } from './PubDiscussions/discussionUtils';
import DiscussionThread from './PubDiscussions/DiscussionThread';

require('./pubBody.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object,
	updateLocalData: PropTypes.func.isRequired,
	onSingleClick: PropTypes.func.isRequired,
};
const defaultProps = {
	firebaseBranchRef: undefined,
};

let setSavingTimeout;

const PubBody = (props) => {
	const { pubData, collabData, firebaseBranchRef, updateLocalData, historyData } = props;
	const { communityData } = useContext(PageContext);
	const { isViewingHistory } = historyData;
	const prevStatusRef = useRef(null);
	const embedDiscussions = useRef({});
	const [editorError, setEditorError] = useState(null);
	prevStatusRef.current = collabData.status;

	useBeforeUnload(
		collabData.status === 'saving',
		'Your pub has not finished saving. Are you sure you wish to leave?',
	);

	const getNextStatus = (status, onComplete) => {
		clearTimeout(setSavingTimeout);
		const prevStatus = prevStatusRef.current;
		const nextStatus = { status: status };

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
			}
		}
		/* If disconnected, only set state if the new status is 'connected' */
		if (prevStatus === 'disconnected' && status === 'connected') {
			onComplete(nextStatus);
		}
	};
	const editorKeyHistory = isViewingHistory && historyData.historyDocKey;
	const editorKeyCollab = firebaseBranchRef ? 'ready' : 'unready';
	const editorKey = editorKeyHistory || editorKeyCollab;
	const isHistoryDoc = isViewingHistory && historyData.historyDoc;
	const useCollaborativeOptions = firebaseBranchRef && !pubData.isStaticDoc && !isHistoryDoc;
	const isReadOnly = !!(pubData.isStaticDoc || !pubData.canEditBranch || isViewingHistory);
	const initialContent = (isViewingHistory && historyData.historyDoc) || pubData.initialDoc;
	const { markLastInput } = useContext(PubSuspendWhileTypingContext);

	return (
		<div className="pub-body-component">
			<style>
				{`
					.editor.ProseMirror h1#abstract:first-child {
						color: ${communityData.accentColorDark};
					}
				`}
			</style>
			<Editor
				key={editorKey}
				customNodes={{
					...discussionSchema,
				}}
				nodeOptions={{
					image: {
						onResizeUrl: (url) => {
							return getResizedUrl(url, 'fit-in', '800x0');
						},
					},
					discussion: {
						addRef: (embedId, mountRef, threadNumber) => {
							embedDiscussions.current[embedId] = {
								mountRef: mountRef,
								threadNumber: threadNumber,
							};
						},
						removeRef: (embedId) => {
							delete embedDiscussions.current[embedId];
						},
					},
				}}
				placeholder={pubData.isStaticDoc ? undefined : 'Begin writing here...'}
				initialContent={initialContent}
				isReadOnly={isReadOnly}
				onChange={(editorChangeObject) => {
					markLastInput();
					if (!isHistoryDoc) {
						updateLocalData('collab', { editorChangeObject: editorChangeObject });
					}
				}}
				onError={(err) => {
					setEditorError(err);
					if (window.sentryIsActive) {
						Sentry.configureScope((scope) => {
							scope.setTag('error_source', 'editor');
						});
						Sentry.captureException(err);
					}
				}}
				collaborativeOptions={
					useCollaborativeOptions
						? {
								firebaseRef: firebaseBranchRef,
								clientData: props.collabData.localCollabUser,
								initialDocKey: pubData.initialDocKey,
								onStatusChange: (status) => {
									getNextStatus(status, (nextStatus) => {
										props.updateLocalData('collab', nextStatus);
									});
								},
								onUpdateLatestKey: (latestKey) => {
									props.updateLocalData('history', {
										latestKey: latestKey,
										currentKey: latestKey,
									});
								},
						  }
						: undefined
				}
				highlights={[]}
				handleSingleClick={props.onSingleClick}
			/>
			{!!editorError && (
				<Alert
					isOpen={editorError}
					confirmButtonText="Refresh Page"
					icon="error"
					onConfirm={() => {
						window.location.reload();
					}}
				>
					<h5>Uh Oh - Editor error</h5>
					<p>Apologies for the interuption.</p>
					<p>We have logged this error and will look into the cause right away.</p>
					<p>To continue editing, please refresh the page.</p>
				</Alert>
			)}
			{/* For now, we have PubBody mount Portals for embedded Discussions */}
			{Object.keys(embedDiscussions.current).map((embedId) => {
				const mountRef = embedDiscussions.current[embedId].mountRef;
				if (!mountRef.current) {
					return null;
				}

				const threadNumber = embedDiscussions.current[embedId].threadNumber;
				const threads = nestDiscussionsToThreads(pubData.discussions);
				const activeThread = threads.reduce((prev, curr) => {
					if (curr[0].threadNumber === threadNumber) {
						return curr;
					}
					return prev;
				}, undefined);

				return ReactDOM.createPortal(
					<React.Fragment>
						{!activeThread && (
							<Card>Please select a discussion from the formatting bar.</Card>
						)}
						{activeThread && (
							<DiscussionThread
								key={embedId}
								pubData={pubData}
								collabData={collabData}
								firebaseBranchRef={firebaseBranchRef}
								threadData={activeThread}
								updateLocalData={updateLocalData}
								canPreview={true}
							/>
						)}
					</React.Fragment>,
					mountRef.current,
				);
			})}
		</div>
	);
};

PubBody.propTypes = propTypes;
PubBody.defaultProps = defaultProps;
export default PubBody;
