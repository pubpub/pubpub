/**
 * An API route helper that retrieves community admin data for a user, or responds with a 403
 * error of the user is not a community admin (or the PubPub team).
 */
import { CommunityAdmin } from '../../models';

const PUBPUB_TEAM_ID = 'b242f616-7aaa-479c-8ee5-3933dcf70859';

const unauthorized = (res) => res.status(403).json('Not authorized as a community admin');

export default (fn) => (req, res, ctx = {}) => {
	if (!req.user) {
		return unauthorized(res);
	}
	const communityIdFromRequest = req.body.communityId || req.query.communityId;
	return CommunityAdmin.findOne({
		where: {
			communityId: communityIdFromRequest,
			userId: req.user.id,
		},
	}).then((communityAdmin) => {
		if (req.user.id !== PUBPUB_TEAM_ID && !communityAdmin) {
			return unauthorized(res);
		}
		return fn(req, res, { ...ctx, communityAdmin: communityAdmin });
	});
};
