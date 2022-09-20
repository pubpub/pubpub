export default (sequelize, dataTypes) => {
	return sequelize.define(
		'LandingPageFeature',
		{
			id: sequelize.idType,
			communityId: { type: dataTypes.UUID, allowNull: true },
			pubId: { type: dataTypes.UUID, allowNull: true },
			rank: { type: dataTypes.TEXT, allowNull: false },
		},
		{
			indexes: [
				{
					fields: ['communityId'],
					unique: true,
				},
				{
					fields: ['pubId'],
					unique: true,
				},
			],
			classMethods: {
				associate: (models) => {
					const { Pub, Community, LandingPageFeature } = models;
					LandingPageFeature.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'pub',
						foreignKey: 'pubId',
					});
					LandingPageFeature.belongsTo(Community, {
						onDelete: 'CASCADE',
						as: 'community',
						foreignKey: 'communityId',
					});
				},
			},
		},
	);
};
