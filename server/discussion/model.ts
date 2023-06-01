export default (sequelize, dataTypes) => {
	return sequelize.define(
		'discussion',
		{
			id: sequelize.idType,
			title: dataTypes.TEXT,
			number: { type: dataTypes.INTEGER, allowNull: false },
			isClosed: dataTypes.BOOLEAN,
			labels: dataTypes.JSONB,
		},
		{
			tableName: 'Discussions',
			indexes: [
				{ fields: ['userId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
			],
			classMethods: {
				associate: ({ discussion, ...models }) => {
					discussion.belongsTo(models.thread, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					discussion.belongsTo(models.visibility, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					discussion.belongsTo(models.user, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: { name: 'userId' },
					});
					discussion.belongsTo(models.commenter, { onDelete: 'CASCADE' });
					discussion.belongsTo(models.pub);
					discussion.hasMany(models.discussionAnchor, {
						onDelete: 'CASCADE',
						as: 'anchors',
						foreignKey: 'discussionId',
					});
				},
			},
		},
	);
};
