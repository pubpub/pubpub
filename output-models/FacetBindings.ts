import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface FacetBindingsAttributes {
	id: string;
	pubId?: string;
	collectionId?: string;
	communityId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'FacetBindings', timestamps: true })
export class FacetBindings
	extends Model<FacetBindingsAttributes, FacetBindingsAttributes>
	implements FacetBindingsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'FacetBindings_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'facet_bindings_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'facet_bindings_collection_id', using: 'btree', unique: false })
	collectionId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'facet_bindings_community_id', using: 'btree', unique: false })
	communityId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
