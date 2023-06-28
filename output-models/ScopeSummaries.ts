import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ScopeSummariesAttributes {
	id: string;
	collections?: number;
	pubs?: number;
	discussions?: number;
	reviews?: number;
	createdAt: Date;
	updatedAt: Date;
	submissions?: number;
}

@Table({ tableName: 'ScopeSummaries', timestamps: true })
export class ScopeSummaries
	extends Model<ScopeSummariesAttributes, ScopeSummariesAttributes>
	implements ScopeSummariesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ScopeSummaries_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	collections?: number;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	pubs?: number;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	discussions?: number;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	reviews?: number;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	submissions?: number;
}
