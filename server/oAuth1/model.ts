export default (sequelize, dataTypes) =>
	sequelize.define(
		'OAuth1Data',
		{
			id: sequelize.idType,
			userId: { type: dataTypes.UUID, allowNull: false },
			integrationId: { type: dataTypes.UUID, allowNull: false },
			accessToken: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { IntegrationDataOAuth1, Integration } = models;
					IntegrationDataOAuth1.belongsTo(Integration, {
						onDelete: 'CASCADE',
						as: 'integration',
						foreignKey: 'integrationId',
					});
				},
			},
		},
	);
