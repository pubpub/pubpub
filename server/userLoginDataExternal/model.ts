export default (sequelize, dataTypes) =>
	sequelize.define('UserLoginDataExternal', {
		id: sequelize.idType,
		userId: { type: dataTypes.UUID, allowNull: false },
		externalProviderId: { type: dataTypes.UUID, allowNull: false },
		externalProviderToken: { type: dataTypes.TEXT },
	});
