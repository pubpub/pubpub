import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ReviewEventsAttributes {
	id: string;
	type?: string;
	data?: object;
	userId: string;
	pubId: string;
	reviewId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'ReviewEvents', timestamps: true })
export class ReviewEvents
	extends Model<ReviewEventsAttributes, ReviewEventsAttributes>
	implements ReviewEventsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ReviewEvents_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING(255) })
	type?: string;

	@Column({ type: DataType.JSONB })
	data?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	reviewId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
