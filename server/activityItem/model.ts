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
				associate: (models) => {
					const { activityItem, pub, collection, community, user } = models;
					activityItem.belongsTo(user, { as: 'actor' });
					activityItem.belongsTo(pub);
					activityItem.belongsTo(collection);
					activityItem.belongsTo(community, { foreignKey: { allowNull: false } });
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
