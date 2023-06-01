export default (sequelize, dataTypes) => {
	return sequelize.define(
		'discussionAnchor',
		{
			id: sequelize.idType,
			isOriginal: { type: dataTypes.BOOLEAN, allowNull: false },
			historyKey: { type: dataTypes.INTEGER, allowNull: false },
			selection: { type: dataTypes.JSONB, allowNull: true },
			originalText: { type: dataTypes.TEXT, allowNull: false },
			originalTextPrefix: { type: dataTypes.TEXT, allowNull: false },
			originalTextSuffix: { type: dataTypes.TEXT, allowNull: false },
		},
		{
			tableName: 'DiscussionAnchors',
			indexes: [{ fields: ['discussionId'], method: 'BTREE' }],
			classMethods: {
				associate: ({ discussionAnchor, ...models }) => {
					discussionAnchor.belongsTo(models.discussion, {
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
