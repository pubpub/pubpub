export default (sequelize, dataTypes) =>
	sequelize.define(
		'IntegrationDataOAuth1',
		{
			accessToken: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { IntegrationDataOAuth1, Integration } = models;
					IntegrationDataOAuth1.belongsTo(Integration, {
						scope: { authSchemeName: 'OAuth1' },
					});
				},
			},
		},
	);
