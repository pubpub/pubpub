export default (sequelize, dataTypes) => {
	return sequelize.define(
		'featureFlagUser',
		{
			id: sequelize.idType,
			enabled: dataTypes.BOOLEAN,
		},
		{
			tableName: 'FeatureFlagUsers',
			classMethods: {
				associate: (models) => {
					const { featureFlag, featureFlagUser, user } = models;
					featureFlagUser.belongsTo(user, { onDelete: 'CASCADE' });
					featureFlagUser.belongsTo(featureFlag, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
