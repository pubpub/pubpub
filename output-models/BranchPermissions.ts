import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface BranchPermissionsAttributes {
	id: string;
	permissions?: any;
	userId: string;
	pubId: string;
	branchId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'BranchPermissions', timestamps: true })
export class BranchPermissions
	extends Model<BranchPermissionsAttributes, BranchPermissionsAttributes>
	implements BranchPermissionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'BranchPermissions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ defaultValue: Sequelize.literal('\'view\'::"enum_BranchPermissions_permissions"') })
	permissions?: any;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	branchId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
