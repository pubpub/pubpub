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
				associate: ({ reviewer, ...models }) => {
					reviewer.belongsTo(models.reviewNew, {
						as: 'review',
						onDelete: 'CASCADE',
						foreignKey: { name: 'reviewId', allowNull: false },
					});
				},
			},
		},
	);
};
