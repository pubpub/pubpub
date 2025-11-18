import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	IsEmail,
	IsLowercase,
	BelongsTo,
	ForeignKey,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { SerializedModel } from 'types';
import { User } from '../models';

@Table
export class EmailChangeToken extends Model<
	InferAttributes<EmailChangeToken>,
	InferCreationAttributes<EmailChangeToken>
> {
	public declare toJSON: <M extends Model>(this: M) => SerializedModel<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.UUID)
	declare userId: string;

	@AllowNull(false)
	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	declare newEmail: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	declare token: string;

	@AllowNull(false)
	@Column(DataType.DATE)
	declare expiresAt: Date;

	@Default(false)
	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	declare used: CreationOptional<boolean>;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	declare user?: User;
}
