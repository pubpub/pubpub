export default (sequelize, dataTypes) =>
	sequelize.define(
		'integration',
		{
			name: { type: dataTypes.TEXT },
			authSchemeName: { type: dataTypes.ENUM('OAuth1', 'Basic') },
			externalUserData: { type: dataTypes.JSONB },
		},
		{
			tableName: 'Integrations',
			classMethods: {
				associate: (models) => {
					const { User, integration, integrationDataOAuth1, integrationDataBasic } =
						models;
					integration.belongsTo(User, { as: 'user', foreignKey: { allowNull: false } });
					integration.hasOne(integrationDataOAuth1);
					integration.hasOne(integrationDataBasic);
				},
			},
		},
	);
/* would love to get the below to work as an instance method
	Integration.prototype.getIntegrationData = function (options) {
		console.log(options, this.get('authSchemaName'));
		return this[
			'getIntegrationData' +
				this.get('authSchemaName')[0].toUpperCase() +
				this.get('authSchemaName').substr(1)
		](options);
	};
	return Integration;
	*/
