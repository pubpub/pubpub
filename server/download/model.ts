import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import {
	AllowNull,
	BelongsTo,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import type { SerializedModel } from 'types';
import { WorkerTask } from '../models';

@Table
export class Download extends Model<InferAttributes<Download>, InferCreationAttributes<Download>> {
	public declare toJSON: <M extends Model>(this: M) => SerializedModel<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.UUID)
	declare communityId: string;

	@Default(DataType.NOW)
	@Column(DataType.DATE)
	declare timestamp: CreationOptional<string>;

	@AllowNull(true)
	@Column(DataType.STRING)
	declare url: CreationOptional<string>;

	@Column(DataType.UUID)
	declare workerTaskId: string | null;

	@BelongsTo(() => WorkerTask, {
		onDelete: 'SET NULL',
		as: 'workerTask',
		foreignKey: 'workerTaskId',
	})
	declare workerTask?: WorkerTask;
}
