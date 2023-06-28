import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ExternalPublicationsAttributes {
	title: string;
	url: string;
	contributors?: object;
	doi?: string;
	description?: string;
	avatar?: string;
	publicationDate?: Date;
	createdAt: Date;
	updatedAt: Date;
	id: string;
}

@Table({ tableName: 'ExternalPublications', timestamps: true })
export class ExternalPublications
	extends Model<ExternalPublicationsAttributes, ExternalPublicationsAttributes>
	implements ExternalPublicationsAttributes
{
	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	url!: string;

	@Column({ type: DataType.JSONB })
	contributors?: object;

	@Column({ type: DataType.STRING })
	doi?: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.DATE })
	publicationDate?: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ExternalPublications_pkey', using: 'btree', unique: true })
	id!: string;
}
