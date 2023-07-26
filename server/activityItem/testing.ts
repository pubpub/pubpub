import { Column, DataType, Model } from 'sequelize-typescript';
import type {
	CreationAttributes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize';
import { InsertableActivityItem } from 'types';

// type ActivityItemKind = 'pub' | 'collection';
// type KindPayloadMap = {
// 	pub: { content: string };
// 	collection: { title: string };
// };

// type KindPayloadMapMap = {
// 	[K in ActivityItemKind]: {
// 		kind: K;
// 		payload: KindPayloadMap[K];
// 	};
// };

// export class ActivityItem<K extends KindPayloadMapMap[ActivityItemKind], Kind extends K['kind'], P extends K['payload']> extends Model<
// 	InferAttributes<ActivityItem<K, Kind, P>>,
// 	InferCreationAttributes<ActivityItem<K, Kind, P>>
// > {
// 	@Column(DataType.STRING)
// 	kind!: Kind;

// 	@Column(DataType.JSONB)
// 	payload!: P | null;
// }

// export const createActivityItem = <A extends ActivityItemKind>(
// 	ai: CreationAttributes<ActivityItem<A> & { kind: A }>,
// ) => ActivityItem.create<ActivityItem<A>>(ai) as Promise<ActivityItem<A>>;

// createActivityItem({
// 	kind: 'pub',
// 	payload: {
// 		title: 'test',
// 		content: 'test',
// 	},
// });

// type TheseThings<M extends Model> = Omit<
// 	Model,
// 	'kind' | 'payload' | 'communityId' | 'collectionId'
// >;

// export class ActivityItemModel<
// 	T extends InsertableActivityItem = InsertableActivityItem,
// > extends Model<TheseThings<ActivityItemModel<T>> & T> {
export class ActivityItemModel<
	T extends InsertableActivityItem = InsertableActivityItem,
> extends Model<
	InferAttributes<ActivityItemModel<T>, { omit: Extract<keyof ActivityItemModel<T>, keyof T> }> &
		T,
	InferCreationAttributes<
		ActivityItemModel<T>,
		{ omit: Extract<keyof ActivityItemModel<T>, keyof T> }
	> &
		T
> {
	// {
	// 	[K in keyof ActivityItemModel<T>]: K extends keyof T ? T[K] : ActivityItemModel<T>[K];
	// }

	kind!: T['kind'];
	payload!: T['payload'];
	id!: CreationOptional<string>;

	pubId!: T['pubId'];

	timestamp!: CreationOptional<Date>;

	communityId!: T['communityId'];

	actorId!: string | null;

	collectionId!: T['collectionId'];
}

ActivityItemModel.create({
	kind: 'member-created',

	payload: {
		collection: {
			title: 'test',
		},
	},
});

// interface PubActivityItem {
// 	kind: 'pub';
// 	payload: { content: string };
// }

// interface CollectionActivityItem {
// 	kind: 'collection';
// 	payload: { title: string };
// }

// interface CollectionActivityItem2 {
// 	kind: 'collection-2';
// 	payload: { title: string; smitle?: string };
// }

// type Scoped<T> =
// 	| { communityId: string; payload: { community: T } }
// 	| { collectionId: string; payload: { collection: T } }
// 	| { pubId: string; payload: { pub: T } };

// type ScopedBase = Scoped<{ title: string }> & {
// 	payload: {
// 		userId: string;
// 	};
// };

// type MemberUpdated = ScopedBase & {
// 	kind: 'member-updated';
// 	payload: {
// 		permissions?: string;
// 	};
// };

// type MemberCreated = ScopedBase & {
// 	kind: 'member-created';
// 	payload: {
// 		permissions: string;
// 	};
// };

// type ActivityItem =
// 	| PubActivityItem
// 	| CollectionActivityItem
// 	| CollectionActivityItem2
// 	| MemberUpdated
// 	| MemberCreated;

// export class ActivityItemModel<T extends ActivityItem = ActivityItem> extends Model<T, T> {
// 	kind!: T['kind'];
// 	payload!: T['payload'];
// }

// let x = {} as ActivityItemModel<MemberCreated>

// if('pubId' in x){
//     x.payload.
// }
