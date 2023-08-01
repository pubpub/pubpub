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
import { User, Pub } from '../models';

@Table
export class PubAttribution extends Model<
	InferAttributes<PubAttribution>,
	InferCreationAttributes<PubAttribution>
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

	// TODO: Add AllowNull(false) for this. Made non-null as that is how its used, but technically still nullable in the db
	@Column(DataType.DOUBLE)
	order!: number;

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
	pubId!: string;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	user?: User;

	@BelongsTo(() => Pub, { onDelete: 'CASCADE', as: 'pub', foreignKey: 'pubId' })
	pub?: Pub;
}
