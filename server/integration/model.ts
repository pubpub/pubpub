export default (sequelize, dataTypes) =>
	sequelize.define(
		'integration',
		{
			name: dataTypes.TEXT,
			authSchemeName: dataTypes.ENUM('OAuth1'), // this frames polymorphism, add schema names here and in corresponding type
			externalUserData: dataTypes.JSONB,
			logoUrl: dataTypes.TEXT,
		},
		{
			tableName: 'Integrations',
			classMethods: {
				associate: (models) => {
					const { User, integration, integrationDataOAuth1 } = models;
					integration.belongsTo(User, { as: 'user', foreignKey: { allowNull: false } });
					integration.hasOne(integrationDataOAuth1);
				},
			},
		},
	);
