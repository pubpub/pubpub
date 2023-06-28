import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface IntegrationDataOAuth1Attributes {
	id: string;
	accessToken?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'IntegrationDataOAuth1', timestamps: true })
export class IntegrationDataOAuth1
	extends Model<IntegrationDataOAuth1Attributes, IntegrationDataOAuth1Attributes>
	implements IntegrationDataOAuth1Attributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'IntegrationDataOAuth1_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	accessToken?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
