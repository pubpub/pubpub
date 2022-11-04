import { creatThreadCommentWithUserOrCommenter } from 'server/thread/queries';
import { ThreadComment, includeUserModel, Commenter } from 'server/models';
import { DocJson } from 'types';

const findThreadCommentWithUser = (id) =>
	ThreadComment.findOne({
		where: { id },
		include: [includeUserModel({ as: 'author' }), { model: Commenter, as: 'commenter' }],
	});

export type CreateThreadOptions = {
	pubId: string;
	discussionId?: string;
	title?: string;
	text: string;
	content: DocJson;
	historyKey: number;
	visibilityAccess: 'members' | 'public';
	threadId: string;
	commenterName?: string;
	userId?: string;
} & ({ userId: string } | { commenterName: string });

export const createThreadComment = async (options: CreateThreadOptions) => {
	const { text, content, commenterName, threadId, userId } = options;

	const user = userId || null;
	const commenter = commenterName || null;

	const { threadCommentId } = await creatThreadCommentWithUserOrCommenter(
		{ text, content, userId: user, commenterName: commenter },
		threadId,
	);

	const threadCommentWithUser = await findThreadCommentWithUser(threadCommentId);
	return threadCommentWithUser;
};

export const updateThreadComment = (inputValues, updatePermissions) => {
	// Filter to only allow certain fields to be updated
	const filteredValues = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});
	return ThreadComment.update(filteredValues, {
		where: { id: inputValues.threadCommentId },
	}).then(() => {
		return {
			...filteredValues,
			id: inputValues.threadCommentId,
		};
	});
};
