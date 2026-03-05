import type {
	Callback,
	PubPageData,
	PubPageDiscussion,
	PubPageThreadComment,
	SpamStatus,
} from 'types';

import React, { useCallback, useState } from 'react';

import { Button, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import TimeAgo from 'react-timeago';

import { apiFetch } from 'client/utils/apiFetch';
import { Avatar, FlagUserDialog, Icon, SpamStatusMenu } from 'components';
import Editor, { type EditorChangeObject, getJSON, getText, viewIsEmpty } from 'components/Editor';
import { buttons, FormattingBar } from 'components/FormattingBar';
import { usePageContext } from 'utils/hooks';
import { getPartsOfFullName } from 'utils/names';

import './threadComment.scss';

type Props = {
	discussionData: PubPageDiscussion;
	threadCommentData: PubPageThreadComment;
	pubData: PubPageData;
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
	const { loginData, communityData, locationData, scopeData } = usePageContext();
	const { isSuperAdmin, canAdminCommunity } = scopeData.activePermissions;
	const [isEditing, setIsEditing] = useState(false);
	const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
	const [changeObject, setChangeObject] = useState<null | EditorChangeObject>(null);
	const [isLoadingEdit, setIsLoadingEdit] = useState(false);
	const [isRetracting, setIsRetracting] = useState(false);

	const handlePutThreadComment = (threadCommentUpdates) => {
		return apiFetch('/api/threadComment', {
			method: 'PUT',
			body: JSON.stringify({
				...threadCommentUpdates,
				accessHash: locationData.query.access,
				parentId: discussionData.id,
				threadId: discussionData.threadId,
				threadCommentId: threadCommentData.id,
				pubId: pubData.id,
				communityId: communityData.id,
			}),
		}).then((updatedThreadCommentData) => {
			updateLocalData('pub', {
				discussions: pubData.discussions.map((discussion) => {
					if (discussion.id === discussionData.id) {
						return {
							...discussion,
							thread: {
								...discussion.thread,
								comments: discussion.thread.comments?.map((comment) => {
									if (comment.id === threadCommentData.id) {
										return { ...comment, ...updatedThreadCommentData };
									}
									return comment;
								}),
							},
						};
					}
					return discussion;
				}),
			});
		});
	};

	const handleSpamStatusChanged = useCallback(
		(status: SpamStatus | null) => {
			const targetUserId = threadCommentData.userId;
			updateLocalData('pub', {
				discussions: pubData.discussions.map((discussion) => ({
					...discussion,
					thread: {
						...discussion.thread,
						comments: discussion.thread.comments?.map((comment) => {
							if (comment.userId !== targetUserId) return comment;
							return {
								...comment,
								author: {
									...comment.author,
									spamTag: status ? { ...comment.author?.spamTag, status } : null,
								},
							};
						}),
					},
				})),
			});
		},
		[threadCommentData.userId, pubData.discussions, updateLocalData],
	);

	const handleFlagged = useCallback(() => {
		const targetUserId = threadCommentData.userId;
		updateLocalData('pub', {
			discussions: pubData.discussions.map((discussion) => ({
				...discussion,
				thread: {
					...discussion.thread,
					comments: discussion.thread.comments?.map((comment) => {
						if (comment.userId !== targetUserId) return comment;
						return {
							...comment,
							author: {
								...comment.author,
								communityModerationReports: [
									...(comment.author?.communityModerationReports ?? []),
									{ id: 'optimistic', status: 'active' as const },
								],
							},
						};
					}),
				},
			})),
		});
	}, [threadCommentData.userId, pubData.discussions, updateLocalData]);

	const handleRetractFlag = useCallback(async () => {
		const reportIds = threadCommentData.author?.communityModerationReports
			?.filter((r) => r.status === 'active')
			?.map((r) => r.id);
		if (!reportIds?.length) return;
		setIsRetracting(true);
		try {
			await Promise.all(
				reportIds.map((id) =>
					apiFetch.put(`/api/communityModerationReports/${id}`, {
						status: 'retracted',
					}),
				),
			);
			const targetUserId = threadCommentData.userId;
			updateLocalData('pub', {
				discussions: pubData.discussions.map((discussion) => ({
					...discussion,
					thread: {
						...discussion.thread,
						comments: discussion.thread.comments?.map((comment) => {
							if (comment.userId !== targetUserId) return comment;
							return {
								...comment,
								author: {
									...comment.author,
									communityModerationReports: [],
								},
							};
						}),
					},
				})),
			});
		} finally {
			setIsRetracting(false);
		}
	}, [threadCommentData, pubData.discussions, updateLocalData]);

	const isAuthor = loginData.id === threadCommentData.userId;
	const renderText = (
		key: string,
		isReadOnly: boolean,
		onChange?: Callback<EditorChangeObject>,
	) => {
		return (
			<Editor
				key={key}
				isReadOnly={isReadOnly}
				initialContent={threadCommentData.content}
				onChange={onChange}
			/>
		);
	};
	const commenterName = discussionData.commenter?.name ?? threadCommentData.commenter?.name;
	const isAuthorSpam = threadCommentData.author?.spamTag?.status === 'confirmed-spam';
	const isAuthorFlagged = threadCommentData.author?.communityModerationReports?.some(
		(report) => report.status === 'active',
	);
	const showFlagButton =
		!isPreview &&
		canAdminCommunity &&
		threadCommentData.userId &&
		threadCommentData.userId !== loginData.id &&
		!isAuthorFlagged;
	const showUnflagButton = !isPreview && canAdminCommunity && isAuthorFlagged;

	return (
		<div
			className={classNames(
				'thread-comment-component',
				isPreview && 'is-preview',
				isAuthorSpam && 'is-spam',
				isAuthorFlagged && !isAuthorSpam && 'is-flagged',
			)}
		>
			<div className="avatar-wrapper">
				<Avatar
					width={18}
					initials={
						threadCommentData.author
							? threadCommentData.author.initials
							: commenterName
								? getPartsOfFullName(commenterName).initials
								: '?'
					}
					avatar={threadCommentData.author?.avatar}
				/>
			</div>
			<div className="content-wrapper">
				<div className="item-header">
					<span className="name">
						{threadCommentData.author
							? threadCommentData.author.fullName
							: (commenterName ?? 'anonymous')}
						{isAuthorSpam && isPreview && <span className="spam-badge">Spam</span>}
						{isAuthorFlagged && !isAuthorSpam && isPreview && (
							<span className="flagged-badge">Flagged</span>
						)}
						{isPreview ? ': ' : ''}
					</span>

					{isPreview && (
						<span className="preview-text">
							{renderText(`preview-${threadCommentData.text}`, true)}
						</span>
					)}
					{!isPreview && (
						<span className="time">
							{!isEditing && (
								<TimeAgo
									minPeriod={60}
									formatter={(value, unit, suffix) => {
										if (unit === 'second') {
											return 'just now';
										}
										let newUnit = unit;
										if (value > 1) {
											newUnit += 's';
										}
										return `${value} ${newUnit} ${suffix}`;
									}}
									date={threadCommentData.createdAt}
								/>
							)}
						</span>
					)}

					<span className="actions">
						{!isPreview && isAuthor && (
							<Button
								icon={isEditing ? undefined : <Icon icon="edit2" iconSize={12} />}
								text={isEditing ? 'Cancel' : undefined}
								minimal={true}
								small={true}
								onClick={() => {
									setIsEditing(!isEditing);
								}}
							/>
						)}
						{showFlagButton && (
							<Button
								icon={<Icon icon="flag" iconSize={12} />}
								minimal
								small
								onClick={() => setIsFlagDialogOpen(true)}
								className="flag-button"
							>
								Flag
							</Button>
						)}
						{showUnflagButton && (
							<Button
								icon={<Icon icon="flag" iconSize={12} />}
								minimal
								small
								loading={isRetracting}
								onClick={handleRetractFlag}
								className="flag-button"
							>
								Unflag
							</Button>
						)}
						{!isPreview && isSuperAdmin && threadCommentData.userId && (
							<SpamStatusMenu
								userId={threadCommentData.userId}
								onStatusChanged={handleSpamStatusChanged}
								currentStatus={threadCommentData.author?.spamTag?.status}
							/>
						)}
					</span>
				</div>
				{!isPreview && isAuthorSpam && (
					<div className="thread-comment-spam-banner">
						This user has been banned. Only you and other admins of this community can
						see this comment. You can safely remove it.
					</div>
				)}
				{!isPreview && isAuthorFlagged && !isAuthorSpam && (
					<div className="thread-comment-flagged-banner">
						This user has been flagged by a community admin. Only you and other admins
						can see this content.
					</div>
				)}
				{!isPreview && (
					<div
						className={classNames({
							'discussion-body-wrapper': true,
							editable: isEditing,
						})}
					>
						{isEditing && changeObject && (
							<FormattingBar
								editorChangeObject={changeObject}
								buttons={buttons.discussionButtonSet}
								isSmall
							/>
						)}
						{renderText(
							`${isEditing}-${threadCommentData.text}`,
							!isEditing,
							(editorChangeObject: EditorChangeObject) => {
								if (isEditing) {
									setChangeObject(editorChangeObject);
								}
							},
						)}
					</div>
				)}
				{isEditing && (
					<Button
						small
						className="discussion-primary-button"
						intent={Intent.PRIMARY}
						text="Update Discussion"
						loading={isLoadingEdit}
						disabled={!!changeObject && viewIsEmpty(changeObject.view.state)}
						onClick={() => {
							setIsLoadingEdit(true);
							handlePutThreadComment({
								// @ts-expect-error ts-migrate(2339) FIXME: Property 'view' does not exist on type '{}'.
								content: getJSON(changeObject.view),
								// @ts-expect-error ts-migrate(2339) FIXME: Property 'view' does not exist on type '{}'.
								text: getText(changeObject.view) || '',
							}).then(() => {
								setIsEditing(false);
								setChangeObject(null);
								setIsLoadingEdit(false);
							});
						}}
					/>
				)}
			</div>
			{canAdminCommunity && threadCommentData.userId && (
				<FlagUserDialog
					isOpen={isFlagDialogOpen}
					onClose={() => setIsFlagDialogOpen(false)}
					userId={threadCommentData.userId}
					communityId={communityData.id}
					threadCommentId={threadCommentData.id}
					userName={threadCommentData.author?.fullName}
					onFlagged={handleFlagged}
				/>
			)}
		</div>
	);
};

export default ThreadComment;
