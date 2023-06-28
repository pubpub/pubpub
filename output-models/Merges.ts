import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface MergesAttributes {
	id: string;
	noteContent?: object;
	noteText?: string;
	userId: string;
	pubId: string;
	sourceBranchId: string;
	destinationBranchId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Merges', timestamps: true })
export class Merges extends Model<MergesAttributes, MergesAttributes> implements MergesAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Merges_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.JSONB })
	noteContent?: object;

	@Column({ type: DataType.STRING })
	noteText?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	sourceBranchId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	destinationBranchId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
