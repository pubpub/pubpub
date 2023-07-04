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

@Table
export class WorkerTask extends Model<
	InferAttributes<WorkerTask>,
	InferCreationAttributes<WorkerTask>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	type!: string;

	@Column(DataType.JSONB)
	input?: object | null;

	@Column(DataType.BOOLEAN)
	isProcessing?: boolean | null;

	@Column(DataType.INTEGER)
	attemptCount?: number | null;

	@Column(DataType.JSONB)
	error?: string | null;

	@Column(DataType.JSONB)
	output?: object | null;

	@Column(DataType.INTEGER)
	priority?: number | null;
}
