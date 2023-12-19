import { Member } from 'server/models';
import { createActivityHooks } from 'server/utils/activityHooks';
import {
	createMemberCreatedActivityItem,
	createMemberUpdatedActivityItem,
	createMemberRemovedActivityItem,
} from 'server/activityItem/queries';
import { setUserSubscriptionStatus } from 'server/userSubscription/queries';
import { getOrCreateUserNotificationPreferences } from 'server/userNotificationPreferences/queries';
import { schedulePurge } from 'server/server';
import { defer } from 'server/utils/deferred';

function purgeUser(userId: string) {
	defer(async () => {
		await schedulePurge(userId);
	});
}

Member.afterCreate(async (member) => {
	const { userId, pubId, collectionId } = member;

	if (pubId || collectionId) {
		purgeUser(userId);
	}

	if (pubId) {
		const userNotificationPreferences = await getOrCreateUserNotificationPreferences(userId);
		if (userNotificationPreferences.subscribeToPubsAsMember) {
			await setUserSubscriptionStatus({
				userId,
				pubId,
				status: 'active',
				setAutomatically: true,
			});
		}
	}
});

Member.afterDestroy(async ({ userId, collectionId, pubId }) => {
	if (pubId || collectionId) {
		purgeUser(userId);
	}
});

createActivityHooks({
	Model: Member,
	onModelCreated: createMemberCreatedActivityItem,
	onModelUpdated: createMemberUpdatedActivityItem,
	onModelDestroyed: createMemberRemovedActivityItem,
});
