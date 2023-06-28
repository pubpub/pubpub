import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UserNotificationsAttributes {
	id: string;
	userId: string;
	userSubscriptionId: string;
	activityItemId: string;
	isRead?: boolean;
	manuallySetIsRead?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'UserNotifications', timestamps: true })
export class UserNotifications
	extends Model<UserNotificationsAttributes, UserNotificationsAttributes>
	implements UserNotificationsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'UserNotifications_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'user_notifications_user_id', using: 'btree', unique: false })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	userSubscriptionId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	activityItemId!: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	isRead?: boolean;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	manuallySetIsRead?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
