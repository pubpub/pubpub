export default (sequelize, dataTypes) => {
	return sequelize.define(
		'userNotificationPreferences',
		{
			id: sequelize.idType,
			receiveNotifications: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: true },
			lastReceivedNotificationsAt: { type: dataTypes.DATE, allowNull: true },
			subscribeToThreadsAsCommenter: {
				type: dataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			subscribeToPubsAsMember: {
				type: dataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			subscribeToPubsAsContributor: {
				type: dataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			notificationCadence: {
				type: dataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			markReadTrigger: {
				type: dataTypes.STRING,
				allowNull: false,
				defaultValue: 'clicked-through',
			},
		},
		{
			tableName: 'UserNotificationPreferences',
			classMethods: {
				associate: ({ userNotificationPreferences, ...models }) => {
					userNotificationPreferences.belongsTo(models.user, {
						foreignKey: { allowNull: false },
					});
				},
			},
			indexes: [{ fields: ['userId'], method: 'BTREE' }],
		},
	);
};
