import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface BranchesAttributes {
	id: string;
	shortId: number;
	title?: string;
	description?: string;
	submissionAlias?: string;
	order?: number;
	publicPermissions?: any;
	pubManagerPermissions?: any;
	communityAdminPermissions?: any;
	viewHash?: string;
	discussHash?: string;
	editHash?: string;
	pubId: string;
	createdAt: Date;
	updatedAt: Date;
	firstKeyAt?: Date;
	latestKeyAt?: Date;
	maintenanceDocId?: string;
}

@Table({ tableName: 'Branches', timestamps: true })
export class Branches
	extends Model<BranchesAttributes, BranchesAttributes>
	implements BranchesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Branches_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	shortId!: number;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	submissionAlias?: string;

	@Column({ type: DataType.DOUBLE })
	order?: number;

	@Column({ defaultValue: Sequelize.literal('\'none\'::"enum_Branches_publicPermissions"') })
	publicPermissions?: any;

	@Column({ defaultValue: Sequelize.literal('\'none\'::"enum_Branches_pubManagerPermissions"') })
	pubManagerPermissions?: any;

	@Column({
		defaultValue: Sequelize.literal('\'none\'::"enum_Branches_communityAdminPermissions"'),
	})
	communityAdminPermissions?: any;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ type: DataType.STRING(255) })
	discussHash?: string;

	@Column({ type: DataType.STRING(255) })
	editHash?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.DATE })
	firstKeyAt?: Date;

	@Column({ type: DataType.DATE })
	latestKeyAt?: Date;

	@Column({ type: DataType.UUID })
	maintenanceDocId?: string;
}
