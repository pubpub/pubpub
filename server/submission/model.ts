import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import type { DocJson, SubmissionStatus } from 'types';
import { Pub, SubmissionWorkflow } from '../models';

@Table
export class Submission extends Model<
	InferAttributes<Submission>,
	InferCreationAttributes<Submission>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	// TODO: This should be an ENUM
	@AllowNull(false)
	@Column(DataType.TEXT)
	status!: SubmissionStatus;

	@Column(DataType.DATE)
	submittedAt!: string | null;

	@AllowNull(false)
	@Column(DataType.UUID)
	submissionWorkflowId!: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	pubId!: string;

	/**
	 * TODO: add validation and better type for abstract
	 * Should probably be DocJSON
	 */
	@Column(DataType.JSONB)
	abstract!: DocJson | null;

	@BelongsTo(() => Pub, { onDelete: 'CASCADE', as: 'pub', foreignKey: 'pubId' })
	pub?: Pub;

	@BelongsTo(() => SubmissionWorkflow, {
		onDelete: 'CASCADE',
		as: 'submissionWorkflow',
		foreignKey: 'submissionWorkflowId',
	})
	submissionWorkflow?: SubmissionWorkflow;
}
