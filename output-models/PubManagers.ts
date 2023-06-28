import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubManagersAttributes {
	id: string;
	userId: string;
	pubId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PubManagers', timestamps: true })
export class PubManagers
	extends Model<PubManagersAttributes, PubManagersAttributes>
	implements PubManagersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubManagers_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
