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
				associate: (models) => {
					const { pub, submission, submissionWorkflow } = models;
					submission.belongsTo(pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					submission.belongsTo(submissionWorkflow, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
