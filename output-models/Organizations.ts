import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface OrganizationsAttributes {
	id: string;
	subdomain: string;
	domain?: string;
	title: string;
	description?: string;
	avatar?: string;
	favicon?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Organizations', timestamps: true })
export class Organizations
	extends Model<OrganizationsAttributes, OrganizationsAttributes>
	implements OrganizationsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Organizations_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Organizations_subdomain_key', using: 'btree', unique: true })
	subdomain!: string;

	@Column({ type: DataType.STRING })
	@Index({ name: 'Organizations_domain_key', using: 'btree', unique: true })
	domain?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.STRING })
	favicon?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
