export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Submission',
		{
			id: sequelize.idType,
			status: {
				type: dataTypes.TEXT,
				allowNull: false,
			},
			submissionWorkflowId: { type: dataTypes.UUID, allowNull: false },
			pubId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Pub, Submission, SubmissionWorklow } = models;
					Submission.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'pub',
						foreignKey: 'pubId',
					});
					Submission.belongsTo(SubmissionWorklow, {
						onDelete: 'CASCADE',
						as: 'submissionWorkflow',
						foreignKey: 'submissionWorkflowId',
					});
				},
			},
		},
	);
};
