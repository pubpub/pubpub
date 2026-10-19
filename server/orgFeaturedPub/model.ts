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

import { Org } from '../org/model';
import { Pub } from '../pub/model';

@Table({
	indexes: [
		{
			unique: true,
			fields: ['orgId', 'pubId'],
			name: 'OrgFeaturedPubs_orgId_pubId_unique',
		},
	],
})
export class OrgFeaturedPub extends Model<
	InferAttributes<OrgFeaturedPub>,
	InferCreationAttributes<OrgFeaturedPub>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@ForeignKey(() => Org)
	@Column(DataType.UUID)
	declare orgId: string;

	@ForeignKey(() => Pub)
	@Column(DataType.UUID)
	declare pubId: string;

	/** Ordering key for curated lists (lexicographic rank string). */
	@AllowNull
	@Column(DataType.TEXT)
	declare rank: string | null;

	/** Whether this pub appears on the org's public landing page. */
	@AllowNull(false)
	@Default(true)
	@Column(DataType.BOOLEAN)
	declare showOnLandingPage: CreationOptional<boolean>;

	/**
	 * Level of data the org can see for this pub.
	 *  - 'none'      — listing only (default)
	 *  - 'requested' — org has asked for analytics access; awaiting pub admin approval
	 *  - 'granted'   — org can see analytics for this pub
	 */
	@AllowNull(false)
	@Default('none')
	@Column(DataType.ENUM('none', 'requested', 'granted'))
	declare dataAccess: CreationOptional<'none' | 'requested' | 'granted'>;

	@BelongsTo(() => Org, { onDelete: 'CASCADE', foreignKey: 'orgId' })
	declare org?: Org;

	@BelongsTo(() => Pub, { onDelete: 'CASCADE', foreignKey: 'pubId' })
	declare pub?: Pub;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	toJSON(): SerializedModel<OrgFeaturedPub> {
		return super.toJSON() as unknown as SerializedModel<OrgFeaturedPub>;
	}
}
