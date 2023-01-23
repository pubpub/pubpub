export default (sequelize, dataTypes) => {
	return sequelize.define(
		'draft',
		{
			id: sequelize.idType,
			latestKeyAt: dataTypes.DATE,
			firebasePath: { type: dataTypes.STRING, allowNull: false },
		},
		{
			tableName: 'Drafts',
			classMethods: {
				associate: (models) => {
					const { pub, draft } = models;
					draft.hasOne(pub);
				},
			},
		},
	);
};
