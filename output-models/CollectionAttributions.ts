import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CollectionAttributionsAttributes {
	id: string;
	name?: string;
	avatar?: string;
	title?: string;
	order?: number;
	isAuthor?: boolean;
	roles?: object;
	affiliation?: string;
	userId?: string;
	collectionId: string;
	createdAt: Date;
	updatedAt: Date;
	orcid?: string;
}

@Table({ tableName: 'CollectionAttributions', timestamps: true })
export class CollectionAttributions
	extends Model<CollectionAttributionsAttributes, CollectionAttributionsAttributes>
	implements CollectionAttributionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CollectionAttributions_pkey', using: 'btree', unique: true })
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
	collectionId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.STRING(255) })
	orcid?: string;
}
