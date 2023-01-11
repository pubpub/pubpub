export default (sequelize, dataTypes) =>
	sequelize.define(
		'Integration',
		{
			id: sequelize.idType,
			userId: { type: dataTypes.UUID, allowNull: false },
			name: { type: dataTypes.TEXT },
			authorizationType: { type: dataTypes.TEXT },
			externalUserData: { type: dataTypes.JSONB },
		},
		{
			classMethods: {
				associate: (models) => {
					const { User, Integration, IntegrationDataOAuth1 } = models;
					Integration.belongsTo(User, { foreignKey: 'userId', as: 'user' });
					Integration.hasOne(IntegrationDataOAuth1, {
						onDelete: 'CASCADE',
						as: 'integrationData',
						constraints: false,
						foreignKey: 'integrationId',
					});
				},
			},
		},
	);
