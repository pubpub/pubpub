export default (sequelize, dataTypes) => {
	return sequelize.define(
		'reviewer',
		{
			id: sequelize.idType,
			name: dataTypes.TEXT,
		},
		{
			tableName: 'Reviewers',
			classMethods: {
				associate: (models) => {
					const { reviewer, reviewNew } = models;
					reviewer.belongsTo(reviewNew, {
						as: 'review',
						onDelete: 'CASCADE',
						foreignKey: { name: 'reviewId', allowNull: false },
					});
				},
			},
		},
	);
};
