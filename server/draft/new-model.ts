import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull, BelongsTo } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { DraftModel } from '../models';

@Table
export class Draft extends Model<InferAttributes<Draft>, InferCreationAttributes<Draft>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.DATE)
	latestKeyAt?: Date | null;

	@AllowNull(false)
	@Column(DataType.STRING)
	firebasePath!: string;

	@Column(DataType.UUID)
	draftId?: string | null;

	@BelongsTo(() => DraftModel, {"as":"draft","foreignKey":"draftId"})
	draft?: DraftModel;
}