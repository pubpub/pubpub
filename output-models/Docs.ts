import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DocsAttributes {
	id: string;
	content: object;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Docs', timestamps: true })
export class Docs extends Model<DocsAttributes, DocsAttributes> implements DocsAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Docs_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.JSONB })
	content!: object;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
