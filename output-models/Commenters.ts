import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CommentersAttributes {
	id: string;
	name?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Commenters', timestamps: true })
export class Commenters
	extends Model<CommentersAttributes, CommentersAttributes>
	implements CommentersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Commenters_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	name?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
