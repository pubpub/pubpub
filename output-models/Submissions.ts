import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface SubmissionsAttributes {
	id: string;
	status: string;
	submittedAt?: Date;
	submissionWorkflowId: string;
	pubId: string;
	abstract?: object;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Submissions', timestamps: true })
export class Submissions
	extends Model<SubmissionsAttributes, SubmissionsAttributes>
	implements SubmissionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Submissions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	status!: string;

	@Column({ type: DataType.DATE })
	submittedAt?: Date;

	@Column({ allowNull: false, type: DataType.UUID })
	submissionWorkflowId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ type: DataType.JSONB })
	abstract?: object;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
