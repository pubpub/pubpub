import * as types from 'types';
import { PubAttribution, UserNotificationPreferences } from 'server/models';
import { setUserSubscriptionStatus } from 'server/userSubscription/queries';

PubAttribution.afterCreate(async (attribution: types.PubAttribution) => {
	const { userId, pubId } = attribution;
	if (userId) {
		const userNotificationPreferences: null | types.UserNotificationPreferences =
			await UserNotificationPreferences.findOne({ where: { userId } });
		if (userNotificationPreferences?.subscribeToPubsAsContributor) {
			await setUserSubscriptionStatus({
				userId,
				pubId,
				status: 'active',
				setAutomatically: true,
			});
		}
	}
});
