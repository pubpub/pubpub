import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	//	HasOne,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
// import { Pub } from '../models';

@Table
export class Draft extends Model<InferAttributes<Draft>, InferCreationAttributes<Draft>> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.DATE)
	latestKeyAt!: Date | null;

	@AllowNull(false)
	@Column(DataType.STRING)
	firebasePath!: string;

	// @HasOne(() => Pub, { as: 'pub', foreignKey: 'draftId' })
	// pub?: Pub;
}
