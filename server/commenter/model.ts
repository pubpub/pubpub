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
				associate: ({ commenter, ...models }) => {
					commenter.hasMany(models.discussion, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
