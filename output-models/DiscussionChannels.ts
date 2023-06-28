import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DiscussionChannelsAttributes {
	id: string;
	title?: string;
	permissions?: any;
	isCommunityAdminModerated?: boolean;
	viewHash?: string;
	writeHash?: string;
	isArchived?: boolean;
	pubId: string;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'DiscussionChannels', timestamps: true })
export class DiscussionChannels
	extends Model<DiscussionChannelsAttributes, DiscussionChannelsAttributes>
	implements DiscussionChannelsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'DiscussionChannels_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({
		defaultValue: Sequelize.literal('\'private\'::"enum_DiscussionChannels_permissions"'),
	})
	permissions?: any;

	@Column({ type: DataType.BOOLEAN })
	isCommunityAdminModerated?: boolean;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ type: DataType.STRING(255) })
	writeHash?: string;

	@Column({ type: DataType.BOOLEAN })
	isArchived?: boolean;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	communityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
