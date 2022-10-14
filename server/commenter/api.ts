import app, { wrap } from 'server/server';
import { createCommenter } from './queries';
import { getPermissions } from './permissions';

const getRequestIds = (req) => {
	const user = req.user || {};
	return {
		userId: user.id,
		pubId: req.body.pubId,
		communityId: req.body.communityId,
		commentAccessHash: req.body.commentAccessHash,
	};
};

app.post(
	'/api/commenter',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const { discussionId, name, threadId } = req.body;
		getPermissions(requestIds)
			.then((permissions) => {
				if (!permissions.create) {
					throw new Error('Not Authorized');
				}
				return createCommenter({
					discussionId,
					name,
					threadId,
				});
			})
			.then((newReview) => {
				return res.status(201).json(newReview);
			})
			.catch((err) => {
				console.error('Error in postReview: ', err);
				return res.status(500).json(err.message);
			});
	}),
);
