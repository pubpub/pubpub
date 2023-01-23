export default (sequelize, dataTypes) => {
	return sequelize.define(
		'featureFlag',
		{
			id: sequelize.idType,
			name: dataTypes.STRING,
			enabledUsersFraction: { type: dataTypes.DOUBLE, defaultValue: 0 },
			enabledCommunitiesFraction: { type: dataTypes.DOUBLE, defaultValue: 0 },
		},
		{
			tableName: 'FeatureFlags',
			indexes: [{ unique: true, fields: ['name'] }],
			classMethods: {
				associate: (models) => {
					const { featureFlag, featureFlagUser, featureFlagCommunity } = models;
					featureFlag.hasMany(featureFlagUser, {
						onDelete: 'CASCADE',
						as: 'users',
						foreignKey: 'featureFlagId',
					});
					featureFlag.hasMany(featureFlagCommunity, {
						onDelete: 'CASCADE',
						as: 'communities',
						foreignKey: 'featureFlagId',
					});
				},
			},
		},
	);
};
