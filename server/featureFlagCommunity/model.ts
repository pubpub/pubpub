export default (sequelize, dataTypes) => {
	return sequelize.define(
		'featureFlagCommunity',
		{
			id: sequelize.idType,
			enabled: dataTypes.BOOLEAN,
		},
		{
			tableName: 'FeatureFlagCommunities',
			classMethods: {
				associate: ({ featureFlagCommunity, ...models }) => {
					featureFlagCommunity.belongsTo(models.community, { onDelete: 'CASCADE' });
					featureFlagCommunity.belongsTo(models.featureFlag, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
