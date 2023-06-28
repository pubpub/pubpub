import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ExportsAttributes {
	id: string;
	format: string;
	url?: string;
	historyKey: number;
	pubId: string;
	workerTaskId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Exports', timestamps: true })
export class Exports
	extends Model<ExportsAttributes, ExportsAttributes>
	implements ExportsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Exports_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	format!: string;

	@Column({ type: DataType.STRING(255) })
	url?: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	historyKey!: number;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ type: DataType.UUID })
	workerTaskId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
