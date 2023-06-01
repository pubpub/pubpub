export default (sequelize, dataTypes) => {
	return sequelize.define(
		'pubAttribution',
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
			tableName: 'PubAttributions',
			classMethods: {
				associate: ({ pubAttribution, ...models }) => {
					pubAttribution.belongsTo(models.user, { onDelete: 'CASCADE' });
					pubAttribution.belongsTo(models.pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
