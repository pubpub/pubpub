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
				associate: (models) => {
					const { featureFlag, featureFlagCommunity, community } = models;
					featureFlagCommunity.belongsTo(community, { onDelete: 'CASCADE' });
					featureFlagCommunity.belongsTo(featureFlag, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
