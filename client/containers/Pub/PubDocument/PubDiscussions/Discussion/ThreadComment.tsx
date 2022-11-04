import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import classNames from 'classnames';
import { Button, Intent } from '@blueprintjs/core';

import Editor, { getText, getJSON, EditorChangeObject, viewIsEmpty } from 'components/Editor';
import { FormattingBar, buttons } from 'components/FormattingBar';
import { Avatar, Icon } from 'components';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';
import { Callback } from 'types';

require('./threadComment.scss');

type Props = {
	discussionData: any;
	threadCommentData: any;
	pubData: any;
	updateLocalData: (...args: any[]) => any;
	isPreview?: boolean;
};

const ThreadComment = (props: Props) => {
	const {
		discussionData,
		threadCommentData,
		pubData,
		updateLocalData,
		isPreview = false,
	} = props;
	const { loginData, communityData, locationData } = usePageContext();
	const [isEditing, setIsEditing] = useState(false);
	const [changeObject, setChangeObject] = useState<null | EditorChangeObject>(null);
	const [isLoadingEdit, setIsLoadingEdit] = useState(false);

	console.log(discussionData, threadCommentData);
	// const handlePutThreadComment = (threadCommentUpdates) => {
	// 	return apiFetch('/api/threadComment', {
	// 		method: 'PUT',
	// 		body: JSON.stringify({
	// 			...threadCommentUpdates,
	// 			accessHash: locationData.query.access,
	// 			parentId: discussionData.id,
	// 			threadId: discussionData.threadId,
	// 			threadCommentId: threadCommentData.id,
	// 			pubId: pubData.id,
	// 			communityId: communityData.id,
	// 		}),
	// 	}).then((updatedThreadCommentData) => {
	// 		updateLocalData('pub', {
	// 			discussions: pubData.discussions.map((discussion) => {
	// 				if (discussion.id === discussionData.id) {
	// 					return {
	// 						...discussion,
	// 						thread: {
	// 							...discussion.thread,
	// 							comments: discussion.thread.comments.map((comment) => {
	// 								if (comment.id === threadCommentData.id) {
	// 									return { ...comment, ...updatedThreadCommentData };
	// 								}
	// 								return comment;
	// 							}),
	// 						},
	// 					};
	// 				}
	// 				return discussion;
	// 			}),
	// 		});
	// 	});
	// };

	// const isAuthor = loginData.id === threadCommentData.userId;
	// const renderText = (
	// 	key: string,
	// 	isReadOnly: boolean,
	// 	onChange?: Callback<EditorChangeObject>,
	// ) => {
	// 	return (
	// 		<Editor
	// 			key={key}
	// 			isReadOnly={isReadOnly}
	// 			initialContent={threadCommentData.content}
	// 			onChange={onChange}
	// 		/>
	// 	);
	// };
	// const commenterName = discussionData.commenters[0]?.name;

	return (
		<div className={classNames('thread-comment-component', isPreview && 'is-preview')}>
			hello
		</div>
	);
};

export default ThreadComment;
