export default (sequelize, dataTypes) =>
	sequelize.define(
		'integrationDataOAuth1',
		{
			accessToken: dataTypes.TEXT,
		},
		{
			tableName: 'IntegrationDataOAuth1',
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
