import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface VersionPermissionsAttributes {
	id: string;
	permissions?: any;
	userId: string;
	pubId: string;
	versionId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'VersionPermissions', timestamps: true })
export class VersionPermissions
	extends Model<VersionPermissionsAttributes, VersionPermissionsAttributes>
	implements VersionPermissionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'VersionPermissions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ defaultValue: Sequelize.literal('\'view\'::"enum_VersionPermissions_permissions"') })
	permissions?: any;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ type: DataType.UUID })
	versionId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
