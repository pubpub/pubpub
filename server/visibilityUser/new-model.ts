import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';


@Table
export class VisibilityUser extends Model<InferAttributes<VisibilityUser>, InferCreationAttributes<VisibilityUser>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	visibilityId!: string;




}