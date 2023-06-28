import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UserNotificationPreferencesAttributes {
	id: string;
	userId: string;
	receiveNotifications?: boolean;
	lastReceivedNotificationsAt?: Date;
	subscribeToThreadsAsCommenter?: boolean;
	subscribeToPubsAsMember?: boolean;
	subscribeToPubsAsContributor?: boolean;
	notificationCadence?: number;
	markReadTrigger?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'UserNotificationPreferences', timestamps: true })
export class UserNotificationPreferences
	extends Model<UserNotificationPreferencesAttributes, UserNotificationPreferencesAttributes>
	implements UserNotificationPreferencesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'UserNotificationPreferences_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'user_notification_preferences_user_id', using: 'btree', unique: false })
	userId!: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('true') })
	receiveNotifications?: boolean;

	@Column({ type: DataType.DATE })
	lastReceivedNotificationsAt?: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('true') })
	subscribeToThreadsAsCommenter?: boolean;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	subscribeToPubsAsMember?: boolean;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	subscribeToPubsAsContributor?: boolean;

	@Column({ allowNull: false, type: DataType.INTEGER, defaultValue: Sequelize.literal('0') })
	notificationCadence?: number;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
		defaultValue: Sequelize.literal("'clicked-through'::character varying"),
	})
	markReadTrigger?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
