export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Commenter',
		{
			id: sequelize.idType,
			name: { type: dataTypes.TEXT },
			discussionId: { type: dataTypes.UUID },
			threadId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Commenter, Discussion } = models;
					Commenter.belongsTo(Discussion, {
						onDelete: 'CASCADE',
						as: 'discussion',
						foreignKey: 'discussionId',
					});
				},
			},
		},
	);
};
