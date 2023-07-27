import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	Index,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { InsertableActivityItem, RecursiveAttributes } from 'types';

@Table
// export class ActivityItem<Kind extends ActivityItemKind = ActivityItemKind> extends Model<
// 	InferAttributes<ActivityItem<Kind>>,
// 	InferCreationAttributes<ActivityItem<Kind>>
// > {
export class ActivityItem<T extends InsertableActivityItem = InsertableActivityItem> extends Model<
	InferAttributes<ActivityItem<T>, { omit: Extract<keyof ActivityItem<T>, keyof T> }> & T,
	InferCreationAttributes<ActivityItem<T>, { omit: Extract<keyof ActivityItem<T>, keyof T> }> & T
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	kind!: T['kind'];

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	pubId!: string | null;

	// TODO: Add validation for payload
	@Column(DataType.JSONB)
	payload!: T['payload'];

	@AllowNull(false)
	@Default(DataType.NOW)
	@Column(DataType.DATE)
	timestamp!: CreationOptional<string>;

	@Index({ using: 'BTREE' })
	@AllowNull(false)
	@Column(DataType.UUID)
	communityId!: string;

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	actorId!: string | null;

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	collectionId!: string | null;
}
