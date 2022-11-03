import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import { Request } from 'server/utils/discussions/types';

import { getCreatePermissions } from './permissions';
import { createDiscussion } from '../discussion/queries';
import { createThreadComment } from '../threadComment/queries';

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
