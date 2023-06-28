import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DiscussionAnchorsAttributes {
	id: string;
	isOriginal: boolean;
	discussionId: string;
	historyKey: number;
	selection?: object;
	originalText: string;
	originalTextPrefix: string;
	originalTextSuffix: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'DiscussionAnchors', timestamps: true })
export class DiscussionAnchors
	extends Model<DiscussionAnchorsAttributes, DiscussionAnchorsAttributes>
	implements DiscussionAnchorsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'DiscussionAnchors_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	isOriginal!: boolean;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'discussion_anchors_discussion_id', using: 'btree', unique: false })
	discussionId!: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	historyKey!: number;

	@Column({ type: DataType.JSONB })
	selection?: object;

	@Column({ allowNull: false, type: DataType.STRING })
	originalText!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	originalTextPrefix!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	originalTextSuffix!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
