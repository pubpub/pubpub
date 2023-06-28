import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface VisibilityUsersAttributes {
	id: string;
	userId: string;
	visibilityId: string;
	createdAt: Date;
	updatedAt: Date;
	userId?: string;
}

@Table({ tableName: 'VisibilityUsers', timestamps: true })
export class VisibilityUsers
	extends Model<VisibilityUsersAttributes, VisibilityUsersAttributes>
	implements VisibilityUsersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'VisibilityUsers_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'VisibilityUsers_visibilityId_UserId_key', using: 'btree', unique: true })
	visibilityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ field: 'UserId', type: DataType.UUID })
	@Index({ name: 'VisibilityUsers_visibilityId_UserId_key', using: 'btree', unique: true })
	userId?: string;
}
