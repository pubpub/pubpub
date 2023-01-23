export default (sequelize, dataTypes) => {
	return sequelize.define(
		'commenter',
		{
			id: sequelize.idType,
			name: dataTypes.TEXT,
		},
		{
			tableName: 'Commenters',
			classMethods: {
				associate: (models) => {
					const { commenter, discussion } = models;
					commenter.hasMany(discussion, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
