export default (sequelize, dataTypes) =>
	sequelize.define(
		'zoteroIntegration',
		{
			id: sequelize.idType,
			zoteroUsername: dataTypes.TEXT,
			zoteroUserId: dataTypes.TEXT,
		},
		{
			tableName: 'ZoteroIntegrations',
			classMethods: {
				associate: ({ zoteroIntegration, ...models }) => {
					zoteroIntegration.belongsTo(models.User, {
						as: 'user',
						foreignKey: { allowNull: false },
					});
					zoteroIntegration.belongsTo(models.integrationDataOAuth1, {
						foreignKey: { allowNull: false },
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
