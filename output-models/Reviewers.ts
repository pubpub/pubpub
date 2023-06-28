import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ReviewersAttributes {
	id: string;
	name?: string;
	reviewId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Reviewers', timestamps: true })
export class Reviewers
	extends Model<ReviewersAttributes, ReviewersAttributes>
	implements ReviewersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Reviewers_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	name?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	reviewId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
