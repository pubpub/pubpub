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
					const { integrationDataOAuth1, zoteroIntegration } = models;
					integrationDataOAuth1.hasOne(zoteroIntegration, {
						foreignKey: { allowNull: false },
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
