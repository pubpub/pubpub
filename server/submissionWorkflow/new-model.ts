import { Model, Table, Column, DataType, PrimaryKey, Default, AllowNull, HasMany, BelongsTo } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Submission, Collection } from '../models';

@Table
export class SubmissionWorkflow extends Model<InferAttributes<SubmissionWorkflow>, InferCreationAttributes<SubmissionWorkflow>> {

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	title!: string;

	@Column(DataType.UUID)
	collectionId?: string | null;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	enabled!: boolean;

	@AllowNull(false)
	@Column(DataType.JSONB)
	instructionsText!: object;

	@AllowNull(false)
	@Column(DataType.JSONB)
	acceptedText!: object;

	@AllowNull(false)
	@Column(DataType.JSONB)
	declinedText!: object;

	@AllowNull(false)
	@Column(DataType.JSONB)
	receivedEmailText!: object;

	@AllowNull(false)
	@Column(DataType.JSONB)
	introText!: object;

	@AllowNull(false)
	@Default([])
	@Column(DataType.JSONB)
	targetEmailAddresses!: CreationOptional<object>;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	requireAbstract!: CreationOptional<boolean>;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	requireDescription!: CreationOptional<boolean>;



	@HasMany(() => Submission, {"as":"submissions","foreignKey":"submissionWorkflowId"})
	submissions?: Submission[];

	@BelongsTo(() => Collection, {"as":"collection","foreignKey":"collectionId"})
	collection?: Collection;
}