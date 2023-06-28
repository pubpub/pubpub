import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UserSubscriptionsAttributes {
	id: string;
	userId: string;
	pubId?: string;
	threadId?: string;
	createdAt: Date;
	updatedAt: Date;
	setAutomatically?: boolean;
	status?: string;
}

@Table({ tableName: 'UserSubscriptions', timestamps: true })
export class UserSubscriptions
	extends Model<UserSubscriptionsAttributes, UserSubscriptionsAttributes>
	implements UserSubscriptionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'UserSubscriptions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'user_subscriptions_user_id', using: 'btree', unique: false })
	userId!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'user_subscriptions_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'user_subscriptions_thread_id', using: 'btree', unique: false })
	threadId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('true') })
	setAutomatically?: boolean;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		defaultValue: Sequelize.literal("'active'::text"),
	})
	status?: string;
}
