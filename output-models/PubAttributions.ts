import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubAttributionsAttributes {
	id: string;
	name?: string;
	avatar?: string;
	title?: string;
	order?: number;
	isAuthor?: boolean;
	roles?: object;
	affiliation?: string;
	userId?: string;
	pubId: string;
	createdAt: Date;
	updatedAt: Date;
	orcid?: string;
}

@Table({ tableName: 'PubAttributions', timestamps: true })
export class PubAttributions
	extends Model<PubAttributionsAttributes, PubAttributionsAttributes>
	implements PubAttributionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubAttributions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	name?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ type: DataType.DOUBLE })
	order?: number;

	@Column({ type: DataType.BOOLEAN })
	isAuthor?: boolean;

	@Column({ type: DataType.JSONB })
	roles?: object;

	@Column({ type: DataType.STRING })
	affiliation?: string;

	@Column({ type: DataType.UUID })
	userId?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.STRING(255) })
	orcid?: string;
}
