import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';


@Table
export class SpamTag extends Model<InferAttributes<SpamTag>, InferCreationAttributes<SpamTag>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Default("unreviewed")
	@Column(DataType.STRING)
	status!: CreationOptional<string>;

	@Column(DataType.DATE)
	statusUpdatedAt?: Date | null;

	@AllowNull(false)
	@Column(DataType.JSONB)
	fields!: object;

	@AllowNull(false)
	@Column(DataType.DOUBLE)
	spamScore!: number;

	@AllowNull(false)
	@Column(DataType.DATE)
	spamScoreComputedAt!: Date;

	@Default(1)
	@Column(DataType.INTEGER)
	spamScoreVersion?: CreationOptional<number | null>;




}