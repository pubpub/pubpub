import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ReviewNewsAttributes {
	id: string;
	title?: string;
	number: number;
	status?: any;
	releaseRequested?: boolean;
	labels?: object;
	threadId: string;
	visibilityId: string;
	userId?: string;
	pubId?: string;
	createdAt: Date;
	updatedAt: Date;
	reviewContent?: object;
}

@Table({ tableName: 'ReviewNews', timestamps: true })
export class ReviewNews
	extends Model<ReviewNewsAttributes, ReviewNewsAttributes>
	implements ReviewNewsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ReviewNews_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	number!: number;

	@Column({ defaultValue: Sequelize.literal('\'open\'::"enum_ReviewNews_status"') })
	status?: any;

	@Column({ type: DataType.BOOLEAN })
	releaseRequested?: boolean;

	@Column({ type: DataType.JSONB })
	labels?: object;

	@Column({ allowNull: false, type: DataType.UUID })
	threadId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	visibilityId!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'review_news_user_id', using: 'btree', unique: false })
	userId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'review_news_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.JSONB })
	reviewContent?: object;
}
