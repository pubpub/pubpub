export default (sequelize, dataTypes) =>
	sequelize.define('UserNotificationPreferences', {
		id: sequelize.idType,
		name: { type: dataTypes.TEXT },
		webServiceEndPoint: { type: dataTypes.TEXT },
	});
