import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

import type { SerializedModel } from 'types';

import {
	AllowNull,
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';

import { Community } from '../community/model';
import { Org } from '../org/model';

/**
 * Per-org opt-out.
 * When a row exists for (communityId, orgId), that community
 * has rejected association with that specific org.
 */
@Table({ tableName: 'HubOptOuts' })
export class HubOptOut extends Model<
	InferAttributes<HubOptOut>,
	InferCreationAttributes<HubOptOut>
> {
	toJSON(): SerializedModel<HubOptOut> {
		return super.toJSON() as unknown as SerializedModel<HubOptOut>;
	}

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@AllowNull(false)
	@ForeignKey(() => Community)
	@Column(DataType.UUID)
	declare communityId: string;

	@AllowNull(false)
	@ForeignKey(() => Org)
	@Column(DataType.UUID)
	declare orgId: string;

	@BelongsTo(() => Community, { onDelete: 'CASCADE' })
	declare community?: Community;

	@BelongsTo(() => Org, { onDelete: 'CASCADE' })
	declare org?: Org;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}
