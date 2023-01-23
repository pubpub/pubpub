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
				associate: (models) => {
					const {
						discussion,
						discussionAnchor,
						visibility,
						pub,
						user,
						thread,
						commenter,
					} = models;
					discussion.belongsTo(thread, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					discussion.belongsTo(visibility, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					discussion.belongsTo(user, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: { name: 'userId' },
					});
					discussion.belongsTo(commenter, { onDelete: 'CASCADE' });
					discussion.belongsTo(pub);
					discussion.hasMany(discussionAnchor, {
						onDelete: 'CASCADE',
						as: 'anchors',
						foreignKey: 'discussionId',
					});
				},
			},
		},
	);
};
