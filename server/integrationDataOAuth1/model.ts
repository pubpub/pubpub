export default (sequelize, dataTypes) =>
	sequelize.define(
		'integrationDataOAuth1',
		{
			accessToken: { type: dataTypes.TEXT },
		},
		{
			tableName: 'IntegrationDataOAuth1',
			freezeTableName: true, // prevents sequelize pluralizing table name
			classMethods: {
				associate: (models) => {
					const { integrationDataOAuth1, integration } = models;
					integrationDataOAuth1.belongsTo(integration, {
						scope: { authSchemeName: 'OAuth1' },
					});
				},
			},
		},
	);
