import { CommunityActivityItem } from './community';
import { CollectionActivityItem } from './collection';
import { PubActivityItem } from './pub';
import { MemberActivityItem } from './member';

export * from './community';
export * from './collection';
export * from './pub';
export * from './member';

export type InsertableActivityItem =
	| CommunityActivityItem
	| CollectionActivityItem
	| PubActivityItem
	| MemberActivityItem;

export type ActivityItem = InsertableActivityItem & {
	id: string;
	createdAt: string;
	updatedAt: string;
};

export type ActivityItemRecord<T> = T extends Record<ActivityItem['kind'], any> ? T : never;

export {
	ActivityAssociationIds,
	ActivityAssociations,
	ActivityAssociationType,
	activityAssociationTypes,
	ActivityItemsContext,
	ActivityAssociationModels,
} from './associations';
