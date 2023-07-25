import { CascadedFacetsForScopes } from 'facets';
import {
	UserNotification as UserNotificationModel,
	ActivityItem as ActivityItemModel,
	UserNotificationPreferences as UserNotificationPreferencesModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';
import { ActivityAssociations } from './activity';
import { UserSubscription } from './userSubscription';

export type UserNotification = RecursiveAttributes<UserNotificationModel>;

export type UserNotificationWithActivityItemModel = UserNotificationModel & {
	activityItem:
		| ActivityItemModel<'pub-discussion-comment-added'>
		| ActivityItemModel<'pub-review-comment-added'>;
};

export type UserNotificationWithActivityItem =
	RecursiveAttributes<UserNotificationWithActivityItemModel>;

export type UserNotificationMarkReadTrigger = 'seen' | 'clicked-through' | 'manual';

export type UserNotificationPreferences = RecursiveAttributes<UserNotificationPreferencesModel>;

export type UserNotificationsFetchResult = {
	notifications: UserNotificationWithActivityItem[];
	associations: ActivityAssociations;
	subscriptions: UserSubscription[];
	facets: CascadedFacetsForScopes<'PubHeaderTheme'>;
	notificationPreferences: UserNotificationPreferences;
};
