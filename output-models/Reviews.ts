import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ReviewsAttributes {
	id: string;
	shortId: number;
	isClosed?: boolean;
	isCompleted?: boolean;
	mergeId?: string;
	pubId: string;
	sourceBranchId: string;
	destinationBranchId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Reviews', timestamps: true })
export class Reviews
	extends Model<ReviewsAttributes, ReviewsAttributes>
	implements ReviewsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Reviews_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	shortId!: number;

	@Column({ type: DataType.BOOLEAN })
	isClosed?: boolean;

	@Column({ type: DataType.BOOLEAN })
	isCompleted?: boolean;

	@Column({ type: DataType.UUID })
	mergeId?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	sourceBranchId!: string;

	@Column({ type: DataType.UUID })
	destinationBranchId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
