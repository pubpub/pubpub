import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface AnchorsAttributes {
	id: string;
	prefix?: string;
	exact?: string;
	suffix?: string;
	from?: number;
	to?: number;
	branchKey?: number;
	branchId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Anchors', timestamps: true })
export class Anchors
	extends Model<AnchorsAttributes, AnchorsAttributes>
	implements AnchorsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Anchors_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	prefix?: string;

	@Column({ type: DataType.STRING })
	exact?: string;

	@Column({ type: DataType.STRING })
	suffix?: string;

	@Column({ type: DataType.INTEGER })
	from?: number;

	@Column({ type: DataType.INTEGER })
	to?: number;

	@Column({ type: DataType.INTEGER })
	branchKey?: number;

	@Column({ type: DataType.UUID })
	branchId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
