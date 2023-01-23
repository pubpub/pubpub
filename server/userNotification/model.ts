export default (sequelize, dataTypes) => {
	return sequelize.define(
		'userNotification',
		{
			id: sequelize.idType,
			isRead: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
			manuallySetIsRead: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		},
		{
			tableName: 'UserNotifications',
			indexes: [{ fields: ['userId'], method: 'BTREE' }],
			classMethods: {
				associate: (models) => {
					const { activityItem, user, userNotification, userSubscription } = models;
					userNotification.belongsTo(activityItem, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					userNotification.belongsTo(userSubscription, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					userNotification.belongsTo(user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
