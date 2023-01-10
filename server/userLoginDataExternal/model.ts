export default (sequelize, dataTypes) =>
	sequelize.define(
		'UserLoginDataExternal',
		{
			id: sequelize.idType,
			userId: { type: dataTypes.UUID, allowNull: false },
			externalProviderId: { type: dataTypes.UUID, allowNull: false },
			externalProviderToken: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { UserLoginDataExternal, ExternalLoginProvider } = models;
					UserLoginDataExternal.belongsTo(ExternalLoginProvider, {
						onDelete: 'CASCADE',
						as: 'externalLoginProvider',
						foreignKey: 'externalLoginProviderId',
					});
				},
			},
		},
	);
