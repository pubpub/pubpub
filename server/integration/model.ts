const Integration = (sequelize, dataTypes) =>
	sequelize.define('Integration', {
		name: { type: dataTypes.TEXT },
		authSchemeName: { type: dataTypes.ENUM('OAuth1', 'Basic') },
		externalUserData: { type: dataTypes.JSONB },
	});

Integration.prototype.getIntegrationData = function (options) {
	return this[
		'getIntegrationData' +
			this.get('authSchemaName')[0].toUpperCase() +
			this.get('authSchemaName').substr(1)
	](options);
};

export default Integration;
