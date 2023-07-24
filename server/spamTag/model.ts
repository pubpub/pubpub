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
import { SpamStatus } from 'types';

@Table
export class SpamTag extends Model<InferAttributes<SpamTag>, InferCreationAttributes<SpamTag>> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	// TODO: this should probably be an enum
	@AllowNull(false)
	@Default('unreviewed')
	@Column(DataType.STRING)
	status!: CreationOptional<SpamStatus>;

	@Column(DataType.DATE)
	statusUpdatedAt!: string | null;

	/**
	 * TODO: add validation and better type for fields
	 * Should probably be
	 * {
  heroText: [
    "casino"
  ],
  description?: [
    "casino"
  ]
} | 
	{
  title: [
    "buy"
  ],
  heroTitle?: [
    "buy"
  ],
  subdomain?: [
    "buy"
  ]
}
	 */
	@AllowNull(false)
	@Column(DataType.JSONB)
	fields!: Record<string, string[]>;

	@AllowNull(false)
	@Column(DataType.DOUBLE)
	spamScore!: number;

	@AllowNull(false)
	@Column(DataType.DATE)
	spamScoreComputedAt!: string;

	@Default(1)
	@Column(DataType.INTEGER)
	spamScoreVersion!: CreationOptional<number | null>;
}
