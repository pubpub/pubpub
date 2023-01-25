export default (sequelize, dataTypes) =>
	sequelize.define(
		'integrationDataBasic',
		{
			username: { type: dataTypes.TEXT },
			password: { type: dataTypes.TEXT },
		},
		{
			tableName: 'IntegrationDataBasic',
			classMethods: {
				associate: (models) => {
					const { integrationDataBasic, integration } = models;
					integrationDataBasic.belongsTo(integration, {
						scope: { authSchemeName: 'Basic' },
					});
				},
			},
		},
	);
