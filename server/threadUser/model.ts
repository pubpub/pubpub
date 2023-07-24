import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	IsLowercase,
	IsEmail,
	AllowNull,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { User } from '../models';

@Table
export class ThreadUser extends Model<
	InferAttributes<ThreadUser>,
	InferCreationAttributes<ThreadUser>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Default('viewer')
	@Column(DataType.ENUM('viewer', 'reviewer'))
	type!: CreationOptional<string | null>;

	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	email!: string | null;

	@Column(DataType.TEXT)
	hash!: string | null;

	@Column(DataType.UUID)
	userId!: string | null;

	@AllowNull(false)
	@Column(DataType.UUID)
	threadId!: string;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	user?: User;
}
