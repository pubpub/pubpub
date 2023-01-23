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
				associate: (models) => {
					const { commenter, threadComment, thread, user } = models;
					threadComment.belongsTo(thread, { foreignKey: { allowNull: false } });
					threadComment.belongsTo(user, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: 'userId',
					});
					threadComment.belongsTo(commenter, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
