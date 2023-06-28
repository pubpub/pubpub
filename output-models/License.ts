import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface LicenseAttributes {
	kind?: string;
	copyrightSelection?: object;
	id: string;
	facetBindingId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'License', timestamps: true })
export class License
	extends Model<LicenseAttributes, LicenseAttributes>
	implements LicenseAttributes
{
	@Column({ type: DataType.STRING })
	kind?: string;

	@Column({ type: DataType.JSONB })
	copyrightSelection?: object;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'License_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	facetBindingId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
