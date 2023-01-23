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
				associate: (models) => {
					const { pub, thread, user, userSubscription } = models;
					userSubscription.belongsTo(pub, { onDelete: 'CASCADE' });
					userSubscription.belongsTo(thread, { onDelete: 'CASCADE' });
					userSubscription.belongsTo(user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
