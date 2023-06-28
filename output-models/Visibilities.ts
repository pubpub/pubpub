import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface VisibilitiesAttributes {
	id: string;
	access?: any;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Visibilities', timestamps: true })
export class Visibilities
	extends Model<VisibilitiesAttributes, VisibilitiesAttributes>
	implements VisibilitiesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Visibilities_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ defaultValue: Sequelize.literal('\'private\'::"enum_Visibilities_access"') })
	access?: any;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
