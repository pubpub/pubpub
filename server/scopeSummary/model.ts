import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';

@Table
export class ScopeSummary extends Model<
	InferAttributes<ScopeSummary>,
	InferCreationAttributes<ScopeSummary>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	collections!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	pubs!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	discussions!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	reviews!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	submissions!: CreationOptional<number>;
}
