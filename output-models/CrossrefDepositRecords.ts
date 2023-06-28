import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CrossrefDepositRecordsAttributes {
	id: string;
	depositJson?: object;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'CrossrefDepositRecords', timestamps: true })
export class CrossrefDepositRecords
	extends Model<CrossrefDepositRecordsAttributes, CrossrefDepositRecordsAttributes>
	implements CrossrefDepositRecordsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CrossrefDepositRecords_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.JSONB })
	depositJson?: object;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
