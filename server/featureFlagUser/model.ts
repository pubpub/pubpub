export default (sequelize, dataTypes) => {
	return sequelize.define(
		'FeatureFlagUser',
		{
			id: sequelize.idType,
			featureFlagId: { type: dataTypes.UUID },
			userId: { type: dataTypes.UUID },
			enabled: { type: dataTypes.BOOLEAN },
		},
		{
			classMethods: {
				associate: (models) => {
					const { FeatureFlagUser, User } = models;
					FeatureFlagUser.belongsTo(User, {
						onDelete: 'CASCADE',
						as: 'user',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
