import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DiscussionsAttributes {
	id: string;
	title?: string;
	number: number;
	isClosed?: boolean;
	labels?: object;
	threadId: string;
	visibilityId: string;
	userId?: string;
	anchorId?: string;
	pubId?: string;
	createdAt: Date;
	updatedAt: Date;
	commenterId?: string;
}

@Table({ tableName: 'Discussions', timestamps: true })
export class Discussions
	extends Model<DiscussionsAttributes, DiscussionsAttributes>
	implements DiscussionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'DiscussionNews_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	number!: number;

	@Column({ type: DataType.BOOLEAN })
	isClosed?: boolean;

	@Column({ type: DataType.JSONB })
	labels?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	threadId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	visibilityId!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'discussion_news_user_id', using: 'btree', unique: false })
	@Index({ name: 'discussions_user_id', using: 'btree', unique: false })
	userId?: string;

	@Column({ type: DataType.UUID })
	anchorId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'discussion_news_pub_id', using: 'btree', unique: false })
	@Index({ name: 'discussions_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.UUID })
	commenterId?: string;
}
