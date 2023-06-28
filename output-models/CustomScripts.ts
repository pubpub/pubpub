import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CustomScriptsAttributes {
	id: string;
	communityId?: string;
	type?: string;
	content?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'CustomScripts', timestamps: true })
export class CustomScripts
	extends Model<CustomScriptsAttributes, CustomScriptsAttributes>
	implements CustomScriptsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CustomScripts_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.STRING(255) })
	type?: string;

	@Column({ type: DataType.STRING })
	content?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
