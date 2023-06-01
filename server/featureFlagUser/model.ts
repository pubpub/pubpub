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
				associate: ({ featureFlagUser, ...models }) => {
					featureFlagUser.belongsTo(models.user, { onDelete: 'CASCADE' });
					featureFlagUser.belongsTo(models.featureFlag, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
