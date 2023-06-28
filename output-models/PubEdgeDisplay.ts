import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubEdgeDisplayAttributes {
	defaultsToCarousel?: boolean;
	descriptionIsVisible?: boolean;
	id: string;
	facetBindingId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PubEdgeDisplay', timestamps: true })
export class PubEdgeDisplay
	extends Model<PubEdgeDisplayAttributes, PubEdgeDisplayAttributes>
	implements PubEdgeDisplayAttributes
{
	@Column({ type: DataType.BOOLEAN })
	defaultsToCarousel?: boolean;

	@Column({ type: DataType.BOOLEAN })
	descriptionIsVisible?: boolean;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubEdgeDisplay_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	facetBindingId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
