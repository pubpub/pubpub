export default (sequelize, dataTypes) => {
	return sequelize.define(
		'SubmissionWorkflow',
		{
			id: sequelize.idType,
			enabled: { type: dataTypes.BOOLEAN },
			instructions: { type: dataTypes.JSONB },
			afterSubmittedText: { type: dataTypes.JSONB },
			emailText: { type: dataTypes.JSONB },
			layoutBlock: {
				type: dataTypes.JSONB,
			},
			targetEmailAddress: { type: dataTypes.STRING },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Collection, SubmissionWorkflow } = models;
					SubmissionWorkflow.belongsTo(Collection, {
						onDelete: 'CASCADE',
						as: 'attributions',
						foreignKey: 'collectionId',
					});
				},
			},
		},
	);
};
