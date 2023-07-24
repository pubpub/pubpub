import { Model, Table, Column, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { ThreadComment, ThreadEvent } from '../models';

@Table
export class Thread extends Model<InferAttributes<Thread>, InferCreationAttributes<Thread>> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.BOOLEAN)
	isLocked!: boolean | null;

	@HasMany(() => ThreadComment, { onDelete: 'CASCADE', as: 'comments', foreignKey: 'threadId' })
	comments?: ThreadComment[];

	@HasMany(() => ThreadEvent, { onDelete: 'CASCADE', as: 'events', foreignKey: 'threadId' })
	events?: ThreadEvent[];
}
