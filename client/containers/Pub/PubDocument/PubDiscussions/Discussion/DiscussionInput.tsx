import React, { useState, useEffect, useCallback } from 'react';
import { AnchorButton, Button, Intent, InputGroup } from '@blueprintjs/core';

import Editor, {
	getText,
	getTopLevelImages,
	getJSON,
	removeLocalHighlight,
	convertLocalHighlightToDiscussion,
	getLocalHighlightText,
} from 'components/Editor';
import { Avatar } from 'components';
import { FormattingBar, buttons } from 'components/FormattingBar';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';
import { usePubContext } from 'containers/Pub/pubHooks';

type OwnProps = {
	discussionData: any;
	isPubBottomInput?: boolean;
};

const defaultProps = {
	isPubBottomInput: false,
};

const getPlaceholderText = (isNewThread, isPubBottomInput) => {
	if (isPubBottomInput) {
		return 'Start a discussion here (or highlight some text above to begin one inline)';
	}
	return isNewThread ? 'Add your discussion...' : 'Add a reply...';
};

type Props = OwnProps & typeof defaultProps;

const DiscussionInput = (props: Props) => {
	const { discussionData, isPubBottomInput } = props;
	const { pubData, historyData, collabData, updateLocalData } = usePubContext();
	const {
		loginData,
		locationData,
		communityData,
		scopeData: {
			activePermissions: { canEdit },
		},
	} = usePageContext();
	const pubView = collabData.editorChangeObject!.view;
	const [changeObject, setChangeObject] = useState<any>();
	const [isLoading, setIsLoading] = useState(false);
	const [didFocus, setDidFocus] = useState(false);
	const [editorKey, setEditorKey] = useState(Date.now());
	const [commentAccessHash, setCommentAccessHash] = useState<string | null>();
	const [commenterName, setCommenterName] = useState('anonymous');
	const isNewThread = !discussionData.number;
	const inputView = changeObject?.view;

	useEffect(() => {
		if (!isPubBottomInput && (isNewThread || didFocus) && inputView) {
			inputView.focus();
		}

		// create quewry access handlers for submitting post to discussion
		// do not know why i have to check here but not in ReviewHeaderSticky
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			const query = new URLSearchParams(url.search);
			setCommentAccessHash(query.get('access'));
		}
	}, [isNewThread, inputView, didFocus, isPubBottomInput]);

	const handleThreadPost = async () => {
		setIsLoading(true);
		const initAnchorData = getLocalHighlightText(pubView, discussionData.id);
		const outputData = await apiFetch('/api/threadComment', {
			method: 'POST',
			body: JSON.stringify({
				// common
				accessHash: locationData.query.access,
				parentId: discussionData.id,
				threadId: discussionData.thread.id,
				pubId: pubData.id,
				communityId: communityData.id,
				content: getJSON(changeObject?.view),
				text: getText(changeObject?.view) || '',
				commentAccessHash,
				commenterName,
				// discussion kv
				discussionId: discussionData.id,
				historyKey: historyData.currentKey,
				initAnchorData,
				visibilityAccess:
					pubData.isRelease || pubData.isAVisitingCommenter ? 'public' : 'members',
				// new kv
				isNewThread,
			}),
		});

		updateLocalData('pub', {
			discussions: pubData.discussions.map((disc) => {
				if (disc.thread!.id === outputData.threadId) {
					return {
						...disc,
						thread: {
							...disc.thread,
							comments: [...disc.thread!.comments, outputData],
						},
					};
				}
				return disc;
			}),
		});

		// ! pretty the above will have the same outcome
		// ! but for now lets comment this here to remind
		// updateLocalData('pub', {
		// 	discussions: [...pubData.discussions, outputData],
		// });

		if (isPubBottomInput) {
			setIsLoading(false);
			setEditorKey(Date.now());
		} else {
			convertLocalHighlightToDiscussion(pubView, outputData.id);
		}
	};

	// * creates a new disccussion/thread/thread comment
	// ? figure out what things below are doing for discussions
	// const handlePostDiscussion = async () => {
	// 	const outputData = await apiFetch('/api/discussions', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			discussionId: discussionData.id,
	// 			historyKey: historyData.currentKey,
	// 			initAnchorData,
	// 			visibilityAccess:
	// 				pubData.isRelease || pubData.isAVisitingCommenter ? 'public' : 'members',
	// 		}),
	// 	});
	// };

	const isLoggedIn = loginData.id;
	const redirectString = `?redirect=${locationData.path}${
		locationData.queryString.length > 1 ? locationData.queryString : ''
	}`;

	// this is where we check for commentHash
	const canComment = isLoggedIn || pubData.isAVisitingCommenter;
	const isUser = !!(canEdit || loginData.fullName);

	const handleCommenterNameOnBlur = (evt) => {
		if (evt.key === 'Enter') {
			evt.currentTarget.blur();
		}
	};
	const handleInputChange = useCallback(
		(e) => {
			setCommenterName(e.target.value);
		},
		[setCommenterName],
	);
	const renderUserNameInput = () => {
		return (
			!isUser &&
			pubData.isAVisitingCommenter && (
				<div className="simple-input">
					<p>Add your name?</p>
					<InputGroup
						value={commenterName}
						onChange={handleInputChange}
						onBlur={handleCommenterNameOnBlur}
					/>
				</div>
			)
		);
	};
	return (
		<div className="thread-comment-component input">
			<div className="avatar-wrapper">
				<Avatar width={18} initials={loginData.initials} avatar={loginData.avatar} />
			</div>
			{!canComment && (
				<React.Fragment>
					<AnchorButton
						className="discussion-primary-button"
						text="Login to discuss"
						href={`/login${redirectString}`}
						small={true}
					/>
					{isNewThread && !isPubBottomInput && (
						<Button
							className="discussion-cancel-button"
							text="Cancel"
							small={true}
							onClick={() => {
								removeLocalHighlight(pubView, discussionData.id);
							}}
						/>
					)}
				</React.Fragment>
			)}
			{canComment && !isNewThread && !didFocus && (
				<div>
					<input
						type="text"
						className="simple-input"
						placeholder="Add a reply..."
						onFocus={() => {
							setDidFocus(true);
						}}
					/>
					{renderUserNameInput()}
				</div>
			)}
			{canComment && (isNewThread || didFocus) && (
				<div className="content-wrapper">
					<div className="discussion-body-wrapper editable">
						<FormattingBar
							editorChangeObject={changeObject}
							buttons={buttons.discussionButtonSet}
							isSmall
						/>
						<Editor
							key={editorKey}
							placeholder={getPlaceholderText(isNewThread, isPubBottomInput)}
							onChange={(editorChangeObject) => {
								setChangeObject(editorChangeObject);
							}}
						/>
						<div>{renderUserNameInput()}</div>
					</div>
					<Button
						className="discussion-primary-button"
						intent={Intent.PRIMARY}
						text={isNewThread ? 'Post Discussion' : 'Post Reply'}
						loading={isLoading}
						disabled={
							!getText(changeObject?.view) &&
							!getTopLevelImages(changeObject?.view).length
						}
						onClick={handleThreadPost}
						small={true}
					/>
					{isNewThread && !isPubBottomInput && (
						<Button
							className="discussion-cancel-button"
							text="Cancel"
							small={true}
							onClick={() => {
								removeLocalHighlight(pubView, discussionData.id);
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
};
DiscussionInput.defaultProps = defaultProps;
export default DiscussionInput;
