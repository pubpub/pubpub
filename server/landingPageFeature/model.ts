export default (sequelize, dataTypes) => {
	return sequelize.define(
		'landingPageFeature',
		{
			id: sequelize.idType,
			rank: { type: dataTypes.TEXT, allowNull: false },
			payload: { type: dataTypes.JSONB, allowNull: true },
		},
		{
			tableName: 'LandingPageFeatures',
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
				associate: ({ landingPageFeature, ...models }) => {
					landingPageFeature.belongsTo(models.pub, { onDelete: 'CASCADE' });
					landingPageFeature.belongsTo(models.community, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
