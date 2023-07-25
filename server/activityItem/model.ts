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
import { ActivityItemKind, KindPayloadMap, ActivityItem as ActivityItemType } from 'types';

@Table
export class ActivityItem<Kind extends ActivityItemKind = ActivityItemKind> extends Model<
	InferAttributes<ActivityItem<Kind>>,
	InferCreationAttributes<ActivityItem<Kind>>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: () => ActivityItemType<Kind>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	kind!: Kind;

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	pubId!: string | null;

	// TODO: Add validation for payload
	@Column(DataType.JSONB)
	payload!: KindPayloadMap[Kind] | null;

	@AllowNull(false)
	@Default(DataType.NOW)
	@Column(DataType.DATE)
	timestamp!: CreationOptional<Date>;

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
