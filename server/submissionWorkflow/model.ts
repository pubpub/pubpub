export default (sequelize, dataTypes) => {
	return sequelize.define(
		'SubmissionWorkflow',
		{
			id: sequelize.idType,
			title: { type: dataTypes.TEXT, allowNull: false },
			collectionId: { type: dataTypes.UUID },
			enabled: { type: dataTypes.BOOLEAN, allowNull: false },
			instructionsText: { type: dataTypes.JSONB, allowNull: false },
			congratulationsEmailText: { type: dataTypes.JSONB, allowNull: false },
			condolencesEmailText: { type: dataTypes.JSONB, allowNull: false },
			thanksEmailText: { type: dataTypes.JSONB, allowNull: false },
			introText: { type: dataTypes.JSONB, allowNull: false },
			targetEmailAddress: { type: dataTypes.STRING, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Collection, SubmissionWorkflow } = models;
					SubmissionWorkflow.belongsTo(Collection, {
						as: 'collection',
						foreignKey: 'collectionId',
					});
				},
			},
		},
	);
};
