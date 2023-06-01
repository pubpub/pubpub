export default (sequelize, dataTypes) => {
	return sequelize.define(
		'userSubscription',
		{
			id: sequelize.idType,
			setAutomatically: { type: dataTypes.BOOLEAN, allowNull: false },
			status: { type: dataTypes.STRING, allowNull: false },
		},
		{
			tableName: 'UserSubscriptions',
			indexes: [
				{ fields: ['userId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
				{ fields: ['threadId'], method: 'BTREE' },
			],
			classMethods: {
				associate: ({ userSubscription, ...models }) => {
					userSubscription.belongsTo(models.pub, { onDelete: 'CASCADE' });
					userSubscription.belongsTo(models.thread, { onDelete: 'CASCADE' });
					userSubscription.belongsTo(models.user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
