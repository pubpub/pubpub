export default (sequelize, dataTypes) =>
	sequelize.define(
		'IntegrationDataOAuth1',
		{
			id: sequelize.idType,
			externalUserId: { type: dataTypes.TEXT, allowNull: false },
			externalUsername: { type: dataTypes.TEXT, allowNull: false },
			integrationId: { type: dataTypes.UUID, allowNull: false },
			accessToken: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { IntegrationDataOAuth1, Integration } = models;
					IntegrationDataOAuth1.belongsTo(Integration, {
						scope: { authorizationType: 'OAuth1' },
						onDelete: 'CASCADE',
						as: 'integration',
						foreignKey: 'integrationId',
					});
				},
			},
		},
	);
