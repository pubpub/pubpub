export default (sequelize, dataTypes) => {
	return sequelize.define(
		'FeatureFlagCommunity',
		{
			id: sequelize.idType,
			featureFlagId: { type: dataTypes.UUID },
			communityId: { type: dataTypes.UUID },
			enabled: { type: dataTypes.BOOLEAN },
		},
		{
			classMethods: {
				associate: (models) => {
					const { FeatureFlagCommunity, Community } = models;
					FeatureFlagCommunity.belongsTo(Community, {
						onDelete: 'CASCADE',
						as: 'community',
						foreignKey: 'communityId',
					});
				},
			},
		},
	);
};
