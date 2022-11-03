export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Commenter',
		{
			id: sequelize.idType,
			name: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Commenter, ThreadComment } = models;
					Commenter.hasMany(ThreadComment, {
						onDelete: 'CASCADE',
						as: 'discussion',
						foreignKey: 'discussionId',
					});
				},
			},
		},
	);
};
