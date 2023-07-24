import { Model, Table, Column, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';

@Table
export class CustomScript extends Model<
	InferAttributes<CustomScript>,
	InferCreationAttributes<CustomScript>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.UUID)
	communityId!: string | null;

	@Column(DataType.STRING)
	type!: string | null;

	@Column(DataType.TEXT)
	content!: string | null;
}
