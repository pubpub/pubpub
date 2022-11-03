import { Pub, Thread, ThreadComment } from 'server/models';
import * as types from 'types';
import { getScope } from 'server/utils/queryHelpers';
import {
	canUserInteractWithParent,
	getMatchingDiscussion,
	getMatchingReview,
} from 'server/utils/discussions/getMatchingObject';
import { RequestIds } from 'server/utils/discussions/types';

const getThreadCommentScopeData = async (
	communityId,
	pubId,
	accessHash,
	userId,
	threadId,
	parentId,
	threadCommentId,
): Promise<any> => {
	const [scopeData, discussionData, reviewData, threadData, threadCommentData] =
		await Promise.all([
			getScope({
				communityId,
				pubId,
				loginId: userId,
				accessHash,
			}),
			getMatchingDiscussion(parentId, threadId, pubId),
			getMatchingReview(parentId, threadId, pubId),
			Thread.findOne({ where: { id: threadId } }),
			threadCommentId && ThreadComment.findOne({ where: { id: threadCommentId, threadId } }),
		]);

	return { scopeData, discussionData, reviewData, threadData, threadCommentData };
};

const getDiscussionScopeData = async (
	communityId,
	pubId,
	userId,
	accessHash,
): Promise<types.ScopeData> => {
	const scopeData = await getScope({
		communityId,
		pubId,
		loginId: userId,
		accessHash,
	});
	return scopeData;
};

export const getCreatePermissions = async (requestIds: RequestIds) => {
	const {
		user,
		commentAccessHash,
		pubId,
		isNewThread,
		visibilityAccess,
		communityId,
		accessHash,
		threadId,
		parentId,
		threadCommentId,
	} = requestIds;
	if (!user.id && !commentAccessHash) {
		return {};
	}
	const pub: types.Pub = await Pub.findOne({ where: { id: pubId } });
	const hasAccessHash = pub?.commentHash === commentAccessHash;

	if (isNewThread) {
		const [scopeData] = await Promise.all([
			getDiscussionScopeData(communityId, pubId, user.id, accessHash),
		]);

		const { canView, canCreateDiscussions } = scopeData.activePermissions;
		const nonMembersVisibility = visibilityAccess && visibilityAccess !== 'members';
		return {
			create: canView || (canCreateDiscussions && nonMembersVisibility) || hasAccessHash,
		};
	}

	const [{ scopeData, discussionData, reviewData, threadData, threadCommentData }] =
		await Promise.all([
			getThreadCommentScopeData(
				communityId,
				pubId,
				accessHash,
				user.id,
				threadId,
				parentId,
				threadCommentId,
			),
		]);

	const { canView } = scopeData.activePermissions;
	const notAssociatedWithModel = !reviewData && !discussionData;
	const invalidThreadCommentId = threadCommentId && !threadCommentData;
	const invalidThread = !threadData;

	if (notAssociatedWithModel || invalidThreadCommentId || invalidThread) {
		return {};
	}

	const canInteractWithParent = canUserInteractWithParent(discussionData || reviewData, canView);
	return {
		create: !threadData.isLocked && (canView || canInteractWithParent || hasAccessHash),
	};
};
