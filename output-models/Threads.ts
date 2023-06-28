import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ThreadsAttributes {
	id: string;
	isLocked?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Threads', timestamps: true })
export class Threads
	extends Model<ThreadsAttributes, ThreadsAttributes>
	implements ThreadsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Threads_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.BOOLEAN })
	isLocked?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
