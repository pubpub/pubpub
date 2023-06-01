export default (sequelize, dataTypes) => {
	return sequelize.define(
		'submission',
		{
			id: sequelize.idType,
			status: {
				type: dataTypes.TEXT,
				allowNull: false,
			},
			submittedAt: dataTypes.DATE,
			abstract: { type: dataTypes.JSONB, allowNull: true },
		},
		{
			tableName: 'Submissions',
			classMethods: {
				associate: ({ submission, ...models }) => {
					submission.belongsTo(models.pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					submission.belongsTo(models.submissionWorkflow, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
