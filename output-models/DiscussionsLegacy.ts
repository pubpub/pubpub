import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DiscussionsLegacyAttributes {
	id: string;
	title?: string;
	threadNumber: number;
	text?: string;
	content?: object;
	attachments?: object;
	suggestions?: object;
	highlights?: object;
	submitHash?: string;
	submitApprovedAt?: Date;
	isArchived?: boolean;
	labels?: object;
	userId: string;
	pubId?: string;
	communityId?: string;
	discussionChannelId?: string;
	branchId?: string;
	createdAt: Date;
	updatedAt: Date;
	initAnchorText?: object;
	isPublic?: boolean;
	initBranchId?: string;
	collectionId?: string;
	organizationId?: string;
}

@Table({ tableName: 'DiscussionsLegacy', timestamps: true })
export class DiscussionsLegacy
	extends Model<DiscussionsLegacyAttributes, DiscussionsLegacyAttributes>
	implements DiscussionsLegacyAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Discussions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	threadNumber!: number;

	@Column({ type: DataType.STRING })
	text?: string;

	@Column({ type: DataType.JSONB })
	content?: object;

	@Column({ type: DataType.JSONB })
	attachments?: object;

	@Column({ type: DataType.JSONB })
	suggestions?: object;

	@Column({ type: DataType.JSONB })
	highlights?: object;

	@Column({ type: DataType.STRING })
	submitHash?: string;

	@Column({ type: DataType.DATE })
	submitApprovedAt?: Date;

	@Column({ type: DataType.BOOLEAN })
	isArchived?: boolean;

	@Column({ type: DataType.JSONB })
	labels?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ type: DataType.UUID })
	pubId?: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.UUID })
	discussionChannelId?: string;

	@Column({ type: DataType.UUID })
	branchId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.JSONB })
	initAnchorText?: object;

	@Column({ type: DataType.BOOLEAN })
	isPublic?: boolean;

	@Column({ type: DataType.UUID })
	initBranchId?: string;

	@Column({ type: DataType.UUID })
	collectionId?: string;

	@Column({ type: DataType.UUID })
	organizationId?: string;
}
