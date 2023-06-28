import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ForksAttributes {
	id: string;
	title?: string;
	number: number;
	isClosed?: boolean;
	labels?: object;
	branchId: string;
	threadId: string;
	visibilityId: string;
	userId: string;
	pubId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Forks', timestamps: true })
export class Forks extends Model<ForksAttributes, ForksAttributes> implements ForksAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Forks_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	number!: number;

	@Column({ type: DataType.BOOLEAN })
	isClosed?: boolean;

	@Column({ type: DataType.JSONB })
	labels?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	branchId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	threadId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	visibilityId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'forks_user_id', using: 'btree', unique: false })
	userId!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'forks_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
