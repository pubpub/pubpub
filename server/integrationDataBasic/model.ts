export default (sequelize, dataTypes) =>
	sequelize.define(
		'IntegrationDataBasic',
		{
			username: { type: dataTypes.TEXT },
			password: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { IntegrationDataBasic, Integration } = models;
					IntegrationDataBasic.belongsTo(Integration, {
						scope: { authSchemeName: 'Basic' },
					});
				},
			},
		},
	);
