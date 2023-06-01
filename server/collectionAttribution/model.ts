export default (sequelize, dataTypes) => {
	return sequelize.define(
		'collectionAttribution',
		{
			id: sequelize.idType,
			name: dataTypes.TEXT /* Used for non-account attribution */,
			avatar: dataTypes.TEXT /* Used for non-account attribution */,
			title: dataTypes.TEXT /* Used for non-account attribution */,
			order: dataTypes.DOUBLE,
			isAuthor: dataTypes.BOOLEAN,
			roles: dataTypes.JSONB,
			affiliation: dataTypes.TEXT,
			orcid: dataTypes.STRING,
		},
		{
			tableName: 'CollectionAttributions',
			classMethods: {
				associate: ({ collectionAttribution, ...models }) => {
					collectionAttribution.belongsTo(models.models.user, {
						onDelete: 'CASCADE',
					});
					collectionAttribution.belongsTo(models.models.collection, {
						foreignKey: { allowNull: false },
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
};
