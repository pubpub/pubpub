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

@Table({
	indexes: [
		{
			unique: true,
			fields: ['orgId', 'communityId'],
			// Keeps its pre-rename name so sync() sees it as present. The table goes in phase 2.
			name: 'HubCommunities_hubId_communityId_unique',
		},
	],
})
export class HubCommunity extends Model<
	InferAttributes<HubCommunity>,
	InferCreationAttributes<HubCommunity>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@ForeignKey(() => Org)
	@Column(DataType.UUID)
	declare orgId: string;

	@ForeignKey(() => Community)
	@Column(DataType.UUID)
	declare communityId: string;

	/** Whether this community appears on the org's public landing page. */
	@AllowNull(false)
	@Default(true)
	@Column(DataType.BOOLEAN)
	declare showOnLandingPage: CreationOptional<boolean>;

	/**
	 * Level of data the org can see for this community.
	 *  - 'none'      — aggregate stats only (default)
	 *  - 'requested' — org has asked for deeper access; awaiting community approval
	 *  - 'granted'   — org can see community managers, detailed analytics, etc.
	 */
	@AllowNull(false)
	@Default('none')
	@Column(DataType.ENUM('none', 'requested', 'granted'))
	declare dataAccess: CreationOptional<'none' | 'requested' | 'granted'>;

	@BelongsTo(() => Org, { onDelete: 'CASCADE', foreignKey: 'orgId' })
	declare org?: Org;

	@BelongsTo(() => Community, { onDelete: 'CASCADE', foreignKey: 'communityId' })
	declare community?: Community;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	toJSON(): SerializedModel<HubCommunity> {
		return super.toJSON() as unknown as SerializedModel<HubCommunity>;
	}
}
