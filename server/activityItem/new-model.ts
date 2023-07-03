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

@Table
export class ActivityItem extends Model<
	InferAttributes<ActivityItem>,
	InferCreationAttributes<ActivityItem>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	kind!: string;

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	pubId?: string | null;

	@Column(DataType.JSONB)
	payload?: object | null;

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
	actorId?: string | null;

	@Index({ using: 'BTREE' })
	@Column(DataType.UUID)
	collectionId?: string | null;
}
