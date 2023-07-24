import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	ForeignKey,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User, Visibility } from '../models';

@Table
export class VisibilityUser extends Model<
	InferAttributes<VisibilityUser>,
	InferCreationAttributes<VisibilityUser>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.UUID)
	userId!: string;

	@AllowNull(false)
	@ForeignKey(() => Visibility)
	@Column(DataType.UUID)
	visibilityId!: string;
}
