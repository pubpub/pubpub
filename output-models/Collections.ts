import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CollectionsAttributes {
	id: string;
	title?: string;
	isRestricted?: boolean;
	isPublic?: boolean;
	pageId?: string;
	communityId?: string;
	metadata?: object;
	kind?: string;
	doi?: string;
	createdAt: Date;
	updatedAt: Date;
	readNextPreviewSize?: any;
	viewHash?: string;
	avatar?: string;
	editHash?: string;
	slug: string;
	crossrefDepositRecordId?: string;
	layout?: object;
	scopeSummaryId?: string;
	layoutAllowsDuplicatePubs?: boolean;
}

@Table({ tableName: 'Collections', timestamps: true })
export class Collections
	extends Model<CollectionsAttributes, CollectionsAttributes>
	implements CollectionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Collections_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ type: DataType.BOOLEAN })
	isRestricted?: boolean;

	@Column({ type: DataType.BOOLEAN })
	isPublic?: boolean;

	@Column({ type: DataType.UUID })
	pageId?: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.JSONB })
	metadata?: object;

	@Column({ type: DataType.STRING })
	kind?: string;

	@Column({ type: DataType.STRING })
	doi?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({
		defaultValue: Sequelize.literal('\'choose-best\'::"enum_Collections_readNextPreviewSize"'),
	})
	readNextPreviewSize?: any;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.STRING(255) })
	editHash?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	slug!: string;

	@Column({ type: DataType.UUID })
	crossrefDepositRecordId?: string;

	@Column({
		allowNull: false,
		type: DataType.JSONB,
		defaultValue: Sequelize.literal("'{}'::jsonb"),
	})
	layout?: object;

	@Column({ type: DataType.UUID })
	scopeSummaryId?: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	layoutAllowsDuplicatePubs?: boolean;
}
