import * as types from 'types';
import mailgun from 'mailgun.js';
import stripIndent from 'strip-indent';

import {
	ActivityItem,
	Community,
	Pub,
	User,
	UserNotification,
	UserNotificationPreferences,
} from 'server/models';
import { defer } from 'server/utils/deferred';
import * as urls from 'utils/canonicalUrls';

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY!,
});

const template = async (activityItem: types.PubDiscussionCommentAddedActivityItem) => {
	const community = await Community.findByPk(activityItem.communityId);
	const communityUrl = urls.communityUrl(community);
	const pub = await Pub.findByPk(activityItem.pubId);
	const pubUrl = urls.pubUrl(community, pub, {
		discussionId: activityItem.payload.discussionId,
	});
	return stripIndent(`
    <p>A comment was added to a discussion you are participating in on PubPub:</p>
    <p>
      <a href="${pubUrl}">View Discussion</a>
    </p>
    </p><a href="${communityUrl}/legal/settings#notifications">Unsubscribe</a></p>
  `);
};

const createEmailForUserNotification = async (notification: types.UserNotification) => {
	const userNotificationPreferences: types.UserNotificationPreferences =
		await UserNotificationPreferences.findOne({
			where: {
				userId: notification.userId,
			},
		});
	if (!userNotificationPreferences?.receiveNotifications) {
		return;
	}
	const user: types.UserWithPrivateFields = await User.findByPk(notification.userId);
	const activityItem: types.ActivityItem = await ActivityItem.findByPk(
		notification.activityItemId,
	);
	if (activityItem?.kind === 'pub-discussion-comment-added') {
		await mg.messages.create('mg.pubpub.org', {
			from: 'PubPub Team <hello@mg.pubpub.org>',
			to: [user.email],
			subject: 'New reply to PubPub discussion',
			html: await template(activityItem),
		});
	}
};

UserNotification.afterCreate((item: types.UserNotification) => {
	defer(() => createEmailForUserNotification(item));
});
