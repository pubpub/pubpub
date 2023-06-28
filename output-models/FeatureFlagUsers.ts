import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface FeatureFlagUsersAttributes {
	id: string;
	featureFlagId?: string;
	userId?: string;
	enabled?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'FeatureFlagUsers', timestamps: true })
export class FeatureFlagUsers
	extends Model<FeatureFlagUsersAttributes, FeatureFlagUsersAttributes>
	implements FeatureFlagUsersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'FeatureFlagUsers_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	featureFlagId?: string;

	@Column({ type: DataType.UUID })
	userId?: string;

	@Column({ type: DataType.BOOLEAN })
	enabled?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
