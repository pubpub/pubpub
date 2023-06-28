import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DraftsAttributes {
	id: string;
	latestKeyAt?: Date;
	firebasePath: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Drafts', timestamps: true })
export class Drafts extends Model<DraftsAttributes, DraftsAttributes> implements DraftsAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Drafts_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.DATE })
	latestKeyAt?: Date;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	firebasePath!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
