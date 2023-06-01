export default (sequelize, dataTypes) =>
	sequelize.define(
		'integrationDataOAuth1',
		{
			id: sequelize.idType,
			accessToken: dataTypes.TEXT,
		},
		{
			tableName: 'IntegrationDataOAuth1',
			classMethods: {
				associate: ({ integrationDataOAuth1, ...models }) => {
					integrationDataOAuth1.hasOne(models.zoteroIntegration, {
						foreignKey: { allowNull: false },
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
