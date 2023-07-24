import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { MinimalUser } from 'types';
import { User, Collection } from '../models';

@Table
export class CollectionAttribution extends Model<
	InferAttributes<CollectionAttribution>,
	InferCreationAttributes<CollectionAttribution>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.TEXT)
	name!: string | null;

	@Column(DataType.TEXT)
	avatar!: string | null;

	@Column(DataType.TEXT)
	title!: string | null;

	@Column(DataType.DOUBLE)
	order!: number | null;

	@Column(DataType.BOOLEAN)
	isAuthor!: boolean | null;

	// TODO: Add validation for roles
	@Column(DataType.JSONB)
	roles!: string[] | null;

	@Column(DataType.TEXT)
	affiliation!: string | null;

	@Column(DataType.STRING)
	orcid!: string | null;

	@Column(DataType.UUID)
	userId!: string | null;

	@AllowNull(false)
	@Column(DataType.UUID)
	collectionId!: string;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	user?: MinimalUser;

	@BelongsTo(() => Collection, {
		onDelete: 'CASCADE',
		as: 'collection',
		foreignKey: 'collectionId',
	})
	collection?: Collection;
}
