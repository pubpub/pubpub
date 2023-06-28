import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface NodeLabelsAttributes {
	image?: object;
	video?: object;
	audio?: object;
	table?: object;
	math?: object;
	id: string;
	facetBindingId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'NodeLabels', timestamps: true })
export class NodeLabels
	extends Model<NodeLabelsAttributes, NodeLabelsAttributes>
	implements NodeLabelsAttributes
{
	@Column({ type: DataType.JSONB })
	image?: object;

	@Column({ type: DataType.JSONB })
	video?: object;

	@Column({ type: DataType.JSONB })
	audio?: object;

	@Column({ type: DataType.JSONB })
	table?: object;

	@Column({ type: DataType.JSONB })
	math?: object;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'NodeLabels_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	facetBindingId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
