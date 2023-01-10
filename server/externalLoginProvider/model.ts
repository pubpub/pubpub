export default (sequelize, dataTypes) =>
	sequelize.define(
		'ExternalLoginProvider',
		{
			id: sequelize.idType,
			name: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { ExternalLoginProvider, UserLoginDataExternal } = models;
					ExternalLoginProvider.hasMany(UserLoginDataExternal, {
						onDelete: 'CASCADE',
						as: 'userLoginDatas',
						foreignKey: 'externalLoginProviderId',
					});
				},
			},
		},
	);
