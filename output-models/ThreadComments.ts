import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ThreadCommentsAttributes {
	id: string;
	text?: string;
	content?: object;
	userId?: string;
	threadId: string;
	createdAt: Date;
	updatedAt: Date;
	commenterId?: string;
}

@Table({ tableName: 'ThreadComments', timestamps: true })
export class ThreadComments
	extends Model<ThreadCommentsAttributes, ThreadCommentsAttributes>
	implements ThreadCommentsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ThreadComments_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	text?: string;

	@Column({ type: DataType.JSONB })
	content?: object;

	@Column({ type: DataType.UUID })
	userId?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	threadId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.UUID })
	commenterId?: string;
}
