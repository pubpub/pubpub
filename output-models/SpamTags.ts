import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface SpamTagsAttributes {
	id: string;
	status?: string;
	statusUpdatedAt?: Date;
	fields: object;
	spamScore: number;
	spamScoreComputedAt: Date;
	spamScoreVersion?: number;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'SpamTags', timestamps: true })
export class SpamTags
	extends Model<SpamTagsAttributes, SpamTagsAttributes>
	implements SpamTagsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'SpamTags_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
		defaultValue: Sequelize.literal("'unreviewed'::character varying"),
	})
	status?: string;

	@Column({ type: DataType.DATE })
	statusUpdatedAt?: Date;

	@Column({ allowNull: false, type: DataType.JSONB })
	fields!: object;

	@Column({ allowNull: false, type: DataType.DOUBLE })
	spamScore!: number;

	@Column({ allowNull: false, type: DataType.DATE })
	spamScoreComputedAt!: Date;

	@Column({ type: DataType.INTEGER, defaultValue: Sequelize.literal('1') })
	spamScoreVersion?: number;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
