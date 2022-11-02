import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

// ? is calling permissions from other routes
// ? bad if you use the same queries for the route 🤔
import { getPermissions } from './permissions';
import { createDiscussion } from '../discussion/queries';

type SharedThreadProperties = {
	accessHash;
	user;
	body: {
		parentId;
		threadId;
		pubId;
		communityId;
		content;
		text;
		commentAccessHash;
		commenterName;
		isNewThread: boolean;
		accessHash;
	};
};

type NewDiscussion = SharedThreadProperties & {
	body: { discussionId?; historyKey?; initAnchorData?; visibilityAccess? };
};

type NewThreadComment = SharedThreadProperties & {
	body: { threadCommentId?: string | null };
};

export type Response = NewDiscussion & NewThreadComment;

const getRequestIds = (req: Response) => {
	const user = req.user || {};
	return {
		userId: user.id,
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
		const permissions = await getPermissions(requestIds);
		if (!permissions.create) {
			throw new ForbiddenError();
		}

		const newDiscussion = await createDiscussion(req.body, req.user);
		const newThreadComment = await createThreadComment(req.body, req.user);
		return res.status(201).json(newThreadComment);
	}),
);
