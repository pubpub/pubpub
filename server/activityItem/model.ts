export default (sequelize, dataTypes) => {
	return sequelize.define(
		'activityItem',
		{
			id: sequelize.idType,
			kind: { type: dataTypes.TEXT, allowNull: false },
			payload: dataTypes.JSONB,
			timestamp: {
				type: dataTypes.DATE,
				defaultValue: sequelize.Sequelize.NOW,
				allowNull: false,
			},
		},
		{
			tableName: 'ActivityItems',
			classMethods: {
				associate: ({ activityItem, ...models }) => {
					activityItem.belongsTo(models.user, { as: 'actor' });
					activityItem.belongsTo(models.pub);
					activityItem.belongsTo(models.collection);
					activityItem.belongsTo(models.community, { foreignKey: { allowNull: false } });
				},
			},
			indexes: [
				{ fields: ['communityId'], method: 'BTREE' },
				{ fields: ['collectionId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
				{ fields: ['actorId'], method: 'BTREE' },
			],
		},
	);
};
