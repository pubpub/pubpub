export default (sequelize, dataTypes) => {
	return sequelize.define(
		'threadComment',
		{
			id: sequelize.idType,
			text: dataTypes.TEXT,
			content: dataTypes.JSONB,
		},
		{
			tableName: 'ThreadComments',
			classMethods: {
				associate: ({ threadComment, ...models }) => {
					threadComment.belongsTo(models.thread, { foreignKey: { allowNull: false } });
					threadComment.belongsTo(models.user, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: 'userId',
					});
					threadComment.belongsTo(models.commenter, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
