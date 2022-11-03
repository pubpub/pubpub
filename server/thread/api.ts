import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import { getCreatePermissions } from './permissions';
import { createDiscussion } from '../discussion/queries';
import { createThreadComment } from '../threadComment/queries';

type SharedThreadProperties = {
	accessHash;
	user;
	body: {
		parentId: string;
		threadId: string;
		pubId: string;
		communityId: string;
		content: string;
		text: string;
		commentAccessHash: string;
		commenterName: string;
		isNewThread: boolean;
		accessHash: string;
	};
};

export type NewDiscussion = SharedThreadProperties & {
	body: { discussionId?; historyKey?; initAnchorData?; visibilityAccess? };
};

export type NewThreadComment = SharedThreadProperties & {
	body: { threadCommentId?: string | null };
};

export type Request = NewDiscussion & NewThreadComment;

export type RequestIds = {
	user: any;
	parentId: any;
	threadId: any;
	threadCommentId: string | null;
	pubId: any;
	communityId: any;
	accessHash: any;
	commentAccessHash: any;
	visibilityAccess: any;
	discussionId: any;
	isNewThread: boolean;
};

const getRequestIds = (req: Request) => {
	const user = req.user || {};
	return {
		user,
		parentId: req.body.parentId,
		threadId: req.body.threadId,
		threadCommentId: req.body.threadCommentId || null,
		pubId: req.body.pubId,
		communityId: req.body.communityId,
		accessHash: req.body.accessHash,
		commentAccessHash: req.body.commentAccessHash,
		visibilityAccess: req.body.visibilityAccess,
		discussionId: req.body.discussionId || null,
		isNewThread: req.body.isNewThread,
	};
};

app.post(
	'/api/thread',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getCreatePermissions(requestIds);
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newComment = requestIds.isNewThread
			? await createDiscussion
			: await createThreadComment;

		return res.status(201).json(newComment);
	}),
);
