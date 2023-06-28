import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface WorkerTasksAttributes {
	id: string;
	type: string;
	input?: object;
	isProcessing?: boolean;
	attemptCount?: number;
	error?: object;
	output?: object;
	createdAt: Date;
	updatedAt: Date;
	priority?: number;
}

@Table({ tableName: 'WorkerTasks', timestamps: true })
export class WorkerTasks
	extends Model<WorkerTasksAttributes, WorkerTasksAttributes>
	implements WorkerTasksAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'WorkerTasks_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	type!: string;

	@Column({ type: DataType.JSONB })
	input?: object;

	@Column({ type: DataType.BOOLEAN })
	isProcessing?: boolean;

	@Column({ type: DataType.INTEGER })
	attemptCount?: number;

	@Column({ type: DataType.JSONB })
	error?: object;

	@Column({ type: DataType.JSONB })
	output?: object;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.INTEGER })
	priority?: number;
}
