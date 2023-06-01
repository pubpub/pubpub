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
				associate: ({ userNotification, ...models }) => {
					userNotification.belongsTo(models.activityItem, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					userNotification.belongsTo(models.userSubscription, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					userNotification.belongsTo(models.user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
