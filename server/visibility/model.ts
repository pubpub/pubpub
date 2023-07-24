import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	BelongsToMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { VisibilityAccess } from 'types';
import { VisibilityUser, User } from '../models';

@Table
export class Visibility extends Model<
	InferAttributes<Visibility>,
	InferCreationAttributes<Visibility>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Default('private')
	@Column(DataType.ENUM('private', 'members', 'public'))
	access!: CreationOptional<VisibilityAccess | null>;

	@BelongsToMany(() => User, {
		as: 'users',
		through: () => VisibilityUser,
		foreignKey: 'visibilityId',
	})
	users?: VisibilityUser[];
}
