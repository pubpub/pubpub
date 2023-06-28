import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ZoteroIntegrationsAttributes {
	id: string;
	zoteroUsername?: string;
	zoteroUserId?: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	integrationDataOAuth1Id: string;
}

@Table({ tableName: 'ZoteroIntegrations', timestamps: true })
export class ZoteroIntegrations
	extends Model<ZoteroIntegrationsAttributes, ZoteroIntegrationsAttributes>
	implements ZoteroIntegrationsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ZoteroIntegrations_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	zoteroUsername?: string;

	@Column({ type: DataType.STRING })
	zoteroUserId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	integrationDataOAuth1Id!: string;
}
