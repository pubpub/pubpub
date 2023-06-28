import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ThreadEventsAttributes {
	id: string;
	type?: string;
	data?: object;
	userId: string;
	threadId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'ThreadEvents', timestamps: true })
export class ThreadEvents
	extends Model<ThreadEventsAttributes, ThreadEventsAttributes>
	implements ThreadEventsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ThreadEvents_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING(255) })
	type?: string;

	@Column({ type: DataType.JSONB })
	data?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	threadId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
