import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface LandingPageFeaturesAttributes {
	id: string;
	communityId?: string;
	pubId?: string;
	rank: string;
	payload?: object;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'LandingPageFeatures', timestamps: true })
export class LandingPageFeatures
	extends Model<LandingPageFeaturesAttributes, LandingPageFeaturesAttributes>
	implements LandingPageFeaturesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'LandingPageFeatures_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'landing_page_features_community_id', using: 'btree', unique: true })
	communityId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'landing_page_features_pub_id', using: 'btree', unique: true })
	pubId?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	rank!: string;

	@Column({ type: DataType.JSONB })
	payload?: object;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
