import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CollectionPubsAttributes {
	id: string;
	pubId: string;
	collectionId: string;
	contextHint?: string;
	rank: string;
	isPrimary?: boolean;
	createdAt: Date;
	updatedAt: Date;
	pubRank?: string;
}

@Table({ tableName: 'CollectionPubs', timestamps: true })
export class CollectionPubs
	extends Model<CollectionPubsAttributes, CollectionPubsAttributes>
	implements CollectionPubsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CollectionPubs_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'collection_pubs_collection_id_pub_id', using: 'btree', unique: true })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'collection_pubs_collection_id_pub_id', using: 'btree', unique: true })
	collectionId!: string;

	@Column({ type: DataType.STRING })
	contextHint?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	rank!: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	isPrimary?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		defaultValue: Sequelize.literal("''::text"),
	})
	pubRank?: string;
}
