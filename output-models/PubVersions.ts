import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubVersionsAttributes {
	id: string;
	historyKey?: number;
	branchId?: string;
	pubId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PubVersions', timestamps: true })
export class PubVersions
	extends Model<PubVersionsAttributes, PubVersionsAttributes>
	implements PubVersionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubVersions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.INTEGER })
	historyKey?: number;

	@Column({ type: DataType.UUID })
	branchId?: string;

	@Column({ type: DataType.UUID })
	pubId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
