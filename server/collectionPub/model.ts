import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	Index,
	AllowNull,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { Collection, Pub } from '../models';

@Table
export class CollectionPub extends Model<
	InferAttributes<CollectionPub>,
	InferCreationAttributes<CollectionPub>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Index({ unique: true, name: 'collection_pubs_collection_id_pub_id' })
	@AllowNull(false)
	@Column(DataType.UUID)
	pubId!: string;

	@Index({ unique: true, name: 'collection_pubs_collection_id_pub_id' })
	@AllowNull(false)
	@Column(DataType.UUID)
	collectionId!: string;

	@Column(DataType.TEXT)
	contextHint!: string | null;

	@AllowNull(false)
	@Column(DataType.TEXT)
	rank!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	pubRank!: string;

	@BelongsTo(() => Collection, {
		onDelete: 'CASCADE',
		as: 'collection',
		foreignKey: 'collectionId',
	})
	collection?: Collection;

	@BelongsTo(() => Pub, { onDelete: 'CASCADE', as: 'pub', foreignKey: 'pubId' })
	pub?: Pub;
}
