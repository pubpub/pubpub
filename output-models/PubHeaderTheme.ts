import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubHeaderThemeAttributes {
	backgroundImage?: string;
	backgroundColor?: string;
	textStyle?: string;
	id: string;
	facetBindingId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PubHeaderTheme', timestamps: true })
export class PubHeaderTheme
	extends Model<PubHeaderThemeAttributes, PubHeaderThemeAttributes>
	implements PubHeaderThemeAttributes
{
	@Column({ type: DataType.STRING })
	backgroundImage?: string;

	@Column({ type: DataType.STRING })
	backgroundColor?: string;

	@Column({ type: DataType.STRING })
	textStyle?: string;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubHeaderTheme_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	facetBindingId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
