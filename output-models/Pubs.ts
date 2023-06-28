import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubsAttributes {
	id: string;
	slug: string;
	title: string;
	description?: string;
	avatar?: string;
	useHeaderImage?: boolean;
	draftEditHash?: string;
	draftViewHash?: string;
	doi?: string;
	labels?: object;
	isCommunityAdminManaged?: boolean;
	communityAdminDraftPermissions?: any;
	draftPermissions?: any;
	review?: object;
	downloads?: object;
	headerBackgroundType?: any;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
	viewHash?: string;
	editHash?: string;
	customPublishedAt?: Date;
	metadata?: object;
	crossrefDepositRecordId?: string;
	draftId: string;
	scopeSummaryId?: string;
	htmlTitle?: string;
	reviewHash?: string;
	commentHash?: string;
	htmlDescription?: string;
}

@Table({ tableName: 'Pubs', timestamps: true })
export class Pubs extends Model<PubsAttributes, PubsAttributes> implements PubsAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Pubs_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Pubs_slug_key', using: 'btree', unique: true })
	slug!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.BOOLEAN })
	useHeaderImage?: boolean;

	@Column({ type: DataType.STRING(255) })
	draftEditHash?: string;

	@Column({ type: DataType.STRING(255) })
	draftViewHash?: string;

	@Column({ type: DataType.STRING })
	doi?: string;

	@Column({ type: DataType.JSONB })
	labels?: object;

	@Column({ type: DataType.BOOLEAN })
	isCommunityAdminManaged?: boolean;

	@Column({
		defaultValue: Sequelize.literal('\'none\'::"enum_Pubs_communityAdminDraftPermissions"'),
	})
	communityAdminDraftPermissions?: any;

	@Column({ defaultValue: Sequelize.literal('\'private\'::"enum_Pubs_draftPermissions"') })
	draftPermissions?: any;

	@Column({ type: DataType.JSONB })
	review?: object;

	@Column({ type: DataType.JSONB })
	downloads?: object;

	@Column({ defaultValue: Sequelize.literal('\'color\'::"enum_Pubs_headerBackgroundType"') })
	headerBackgroundType?: any;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'pubs_community_id', using: 'btree', unique: false })
	communityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ type: DataType.STRING(255) })
	editHash?: string;

	@Column({ type: DataType.DATE })
	customPublishedAt?: Date;

	@Column({ type: DataType.JSONB })
	metadata?: object;

	@Column({ type: DataType.UUID })
	crossrefDepositRecordId?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	draftId!: string;

	@Column({ type: DataType.UUID })
	scopeSummaryId?: string;

	@Column({ type: DataType.STRING })
	htmlTitle?: string;

	@Column({ type: DataType.STRING })
	reviewHash?: string;

	@Column({ type: DataType.STRING(255) })
	commentHash?: string;

	@Column({ type: DataType.STRING })
	htmlDescription?: string;
}
