import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';


@Table
export class Doc extends Model<InferAttributes<Doc>, InferCreationAttributes<Doc>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.JSONB)
	content!: object;




}