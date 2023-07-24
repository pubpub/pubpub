import { CascadedFacetsForScopes } from 'facets';
import { Attributes } from 'sequelize';
import {
	UserNotification as UserNotificationModel,
	UserNotificationPreferences as UserNotificationPreferencesModel,
} from 'server/models';
import { ActivityAssociations, ActivityItemOfKind } from './activity';
import { UserSubscription } from './userSubscription';

export type UserNotification = Attributes<UserNotificationModel>;

export type UserNotificationWithActivityItem = UserNotification & {
	activityItem: ActivityItemOfKind<'pub-discussion-comment-added' | 'pub-review-comment-added'>;
};

export type UserNotificationMarkReadTrigger = 'seen' | 'clicked-through' | 'manual';

export type UserNotificationPreferences = Attributes<UserNotificationPreferencesModel>;

export type UserNotificationsFetchResult = {
	notifications: UserNotificationWithActivityItem[];
	associations: ActivityAssociations;
	subscriptions: UserSubscription[];
	facets: CascadedFacetsForScopes<'PubHeaderTheme'>;
	notificationPreferences: UserNotificationPreferences;
};
