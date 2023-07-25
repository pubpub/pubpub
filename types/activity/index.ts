import { ActivityItem as ActivityItemModel } from 'server/models';

import { ScopeId } from '../scope';

import { CommunityActivityItem } from './community';
import { CollectionActivityItem } from './collection';
import { FacetsActivityItem } from './facets';
import { PageActivityItem } from './page';
import { PubActivityItem } from './pub';
import { MemberActivityItem } from './member';
import { ActivityAssociations } from './associations';
import { SubmissionActivityItem } from './submission';
import { RecursiveAttributes } from '../recursiveAttributes';

export * from './community';
export * from './collection';
export * from './facets';
export * from './page';
export * from './pub';
export * from './member';
export * from './submission';

export type InsertableActivityItem =
	| CommunityActivityItem
	| CollectionActivityItem
	| FacetsActivityItem
	| PageActivityItem
	| PubActivityItem
	| MemberActivityItem
	| SubmissionActivityItem;

// export type ActivityItem = InsertableActivityItem & {
// 	id: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	timestamp: string;
// };
// export type ActivityItem = RecursiveAttributes<ActivityItemModel>;

export type ActivityItemKind = InsertableActivityItem['kind'];
export type ActivityItemPayload = InsertableActivityItem['payload'];

// export type KindPayloadMap = {
// 	[K in ActivityItemKind]: (InsertableActivityItem & { kind: K })['payload'];
// };

// type KindPayloadMapMap = {
// 	[K in ActivityItemKind]: {
// 		kind: K;
// 		payload: KindPayloadMap[K];
// 	};
// };
export type ActivityItem<T extends InsertableActivityItem = InsertableActivityItem> =
	RecursiveAttributes<ActivityItemModel<T>>;

// export type ActivityItem<A extends ActivityItemKind = ActivityItemKind> = RecursiveAttributes<
// 	Exclude<ActivityItemModel, 'kind' | 'payload'>
// > &
// 	(A extends A ? KindPayloadMapMap[A] : never);

// export type ActivityItemCreationAttributes<A extends ActivityItemKind = ActivityItemKind> =
// 	RecursiveCreationAttributes<Exclude<ActivityItemModel, 'kind' | 'payload'>> &
// 		(A extends A ? KindPayloadMapMap[A] : never);

export type ActivityItemOfKind<Kind extends ActivityItemKind> = ActivityItem<
	InsertableActivityItem & { kind: Kind }
>;

export {
	ActivityAssociationIds,
	ActivityAssociations,
	ActivityAssociationType,
	activityAssociationTypes,
	ActivityAssociationModels,
} from './associations';

export type ActivityItemsFetchResult = {
	activityItems: ActivityItem[];
	associations: ActivityAssociations;
	fetchedAllItems: boolean;
};

export type ActivityItemsRenderContext = ActivityItemsFetchResult & {
	scope: ScopeId;
};

export { ActivityFilter } from './filters';
