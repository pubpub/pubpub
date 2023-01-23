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
				associate: (models) => {
					const { user, pubAttribution, pub } = models;
					pubAttribution.belongsTo(user, { onDelete: 'CASCADE' });
					pubAttribution.belongsTo(pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
