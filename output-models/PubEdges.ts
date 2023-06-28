import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubEdgesAttributes {
	id: string;
	pubId: string;
	targetExternalPublication?: string;
	targetPubId?: string;
	relationType: string;
	rank: string;
	pubIsParent: boolean;
	approvedByTarget: boolean;
	createdAt: Date;
	updatedAt: Date;
	externalPublicationId?: string;
}

@Table({ tableName: 'PubEdges', timestamps: true })
export class PubEdges
	extends Model<PubEdgesAttributes, PubEdgesAttributes>
	implements PubEdgesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubEdges_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ type: DataType.UUID })
	targetExternalPublication?: string;

	@Column({ type: DataType.UUID })
	targetPubId?: string;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	relationType!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	rank!: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	pubIsParent!: boolean;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	approvedByTarget!: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.UUID })
	externalPublicationId?: string;
}
