export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Reviewer',
		{
			id: sequelize.idType,
			name: { type: dataTypes.TEXT },
			reviewId: { type: dataTypes.UUID },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Reviewer, ReviewNew } = models;
					Reviewer.belongsTo(ReviewNew, {
						onDelete: 'CASCADE',
						as: 'reviewNew',
						foreignKey: 'reviewNewId',
					});
				},
			},
		},
	);
};
