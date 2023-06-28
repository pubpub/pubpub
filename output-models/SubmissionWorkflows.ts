import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface SubmissionWorkflowsAttributes {
	id: string;
	title: string;
	collectionId?: string;
	enabled: boolean;
	instructionsText: object;
	acceptedText: object;
	declinedText: object;
	receivedEmailText: object;
	introText: object;
	requireAbstract?: boolean;
	requireDescription?: boolean;
	createdAt: Date;
	updatedAt: Date;
	targetEmailAddresses?: object;
}

@Table({ tableName: 'SubmissionWorkflows', timestamps: true })
export class SubmissionWorkflows
	extends Model<SubmissionWorkflowsAttributes, SubmissionWorkflowsAttributes>
	implements SubmissionWorkflowsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'SubmissionWorkflows_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ type: DataType.UUID })
	collectionId?: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	enabled!: boolean;

	@Column({ allowNull: false, type: DataType.JSONB })
	instructionsText!: object;

	@Column({ allowNull: false, type: DataType.JSONB })
	acceptedText!: object;

	@Column({ allowNull: false, type: DataType.JSONB })
	declinedText!: object;

	@Column({ allowNull: false, type: DataType.JSONB })
	receivedEmailText!: object;

	@Column({ allowNull: false, type: DataType.JSONB })
	introText!: object;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	requireAbstract?: boolean;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	requireDescription?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({
		allowNull: false,
		type: DataType.JSONB,
		defaultValue: Sequelize.literal("'[]'::jsonb"),
	})
	targetEmailAddresses?: object;
}
