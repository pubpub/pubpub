/**
 * An API route helper that retrieves community admin data for a user, or responds with a 403
 * error of the user is not a community admin (or the PubPub team).
 */
import { CommunityAdmin, Pub } from '../../models';

const PUBPUB_TEAM_ID = 'b242f616-7aaa-479c-8ee5-3933dcf70859';

const unauthorized = (res) => res.status(403).json('Not authorized as a community admin');

export const communityAdminFor = ({ communityId, userId, pubId = null }) =>
	new Promise((resolve, reject) => {
		if (userId === PUBPUB_TEAM_ID) {
			resolve();
		} else {
			CommunityAdmin.findOne({
				where: {
					communityId: communityId,
					userId: userId,
				},
			}).then((communityAdmin) => {
				if (pubId) {
					Pub.findOne({ where: { id: pubId } }).then((pub) => {
						if (pub.communityId === communityId) {
							resolve(communityAdmin);
						} else {
							reject();
						}
					});
				} else {
					resolve(communityAdmin);
				}
			});
		}
	});

export const withCommunityAdmin = (fn) => (req, res, ctx = {}) => {
	if (!req.user) {
		return unauthorized(res);
	}
	const communityIdFromRequest = req.body.communityId || req.query.communityId;
	return communityAdminFor({ userId: req.user.id, communityId: communityIdFromRequest })
		.then((communityAdmin) => {
			return fn(req, res, { ...ctx, communityAdmin: communityAdmin });
		})
		.catch(() => unauthorized(res));
};
