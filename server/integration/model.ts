export default (sequelize, dataTypes) => {
	const Integration = sequelize.define(
		'integration',
		{
			name: { type: dataTypes.TEXT },
			authSchemeName: { type: dataTypes.ENUM('OAuth1', 'Basic') },
			externalUserData: { type: dataTypes.JSONB },
		},
		{ tableName: 'Integrations' },
	);

	Integration.prototype.getIntegrationData = function (options) {
		return this[
			'getIntegrationData' +
				this.get('authSchemaName')[0].toUpperCase() +
				this.get('authSchemaName').substr(1)
		](options);
	};
	return Integration;
};
