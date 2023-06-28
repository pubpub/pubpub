import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface FeatureFlagCommunitiesAttributes {
	id: string;
	featureFlagId?: string;
	communityId?: string;
	enabled?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'FeatureFlagCommunities', timestamps: true })
export class FeatureFlagCommunities
	extends Model<FeatureFlagCommunitiesAttributes, FeatureFlagCommunitiesAttributes>
	implements FeatureFlagCommunitiesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'FeatureFlagCommunities_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	featureFlagId?: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.BOOLEAN })
	enabled?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
