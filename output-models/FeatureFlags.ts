import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface FeatureFlagsAttributes {
	id: string;
	name?: string;
	enabledUsersFraction?: number;
	enabledCommunitiesFraction?: number;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'FeatureFlags', timestamps: true })
export class FeatureFlags
	extends Model<FeatureFlagsAttributes, FeatureFlagsAttributes>
	implements FeatureFlagsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'FeatureFlags_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING(255) })
	@Index({ name: 'feature_flags_name', using: 'btree', unique: true })
	name?: string;

	@Column({ type: DataType.DOUBLE, defaultValue: Sequelize.literal("'0'::double precision") })
	enabledUsersFraction?: number;

	@Column({ type: DataType.DOUBLE, defaultValue: Sequelize.literal("'0'::double precision") })
	enabledCommunitiesFraction?: number;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
