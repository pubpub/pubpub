import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull, HasMany } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { FacetInstance } from '../models';

@Table
export class FacetDefinition extends Model<InferAttributes<FacetDefinition>, InferCreationAttributes<FacetDefinition>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	name!: string;

	@AllowNull(false)
	@Column(DataType.JSONB)
	structure!: object;



	@HasMany(() => FacetInstance, {"onDelete":"CASCADE","as":"instances","foreignKey":"facetDefinitionId"})
	instances?: FacetInstance[];
}