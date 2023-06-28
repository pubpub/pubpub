import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface VersionsAttributes {
	id: string;
	description?: string;
	content?: object;
	isPublic?: boolean;
	isCommunityAdminShared?: boolean;
	viewHash?: string;
	pubId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Versions', timestamps: true })
export class Versions
	extends Model<VersionsAttributes, VersionsAttributes>
	implements VersionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Versions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.JSONB })
	content?: object;

	@Column({ type: DataType.BOOLEAN })
	isPublic?: boolean;

	@Column({ type: DataType.BOOLEAN })
	isCommunityAdminShared?: boolean;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
