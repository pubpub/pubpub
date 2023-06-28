import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DepositTargetsAttributes {
	id: string;
	communityId?: string;
	doiPrefix?: string;
	service?: any;
	username?: string;
	password?: string;
	passwordInitVec?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'DepositTargets', timestamps: true })
export class DepositTargets
	extends Model<DepositTargetsAttributes, DepositTargetsAttributes>
	implements DepositTargetsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'DepositTargets_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.STRING(255) })
	doiPrefix?: string;

	@Column({ defaultValue: Sequelize.literal('\'crossref\'::"enum_DepositTargets_service"') })
	service?: any;

	@Column({ type: DataType.STRING(255) })
	username?: string;

	@Column({ type: DataType.STRING(255) })
	password?: string;

	@Column({ type: DataType.STRING })
	passwordInitVec?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
