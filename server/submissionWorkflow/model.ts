export default (sequelize, dataTypes) => {
	return sequelize.define(
		'submissionWorkflow',
		{
			id: sequelize.idType,
			title: { type: dataTypes.TEXT, allowNull: false },
			enabled: { type: dataTypes.BOOLEAN, allowNull: false },
			instructionsText: { type: dataTypes.JSONB, allowNull: false },
			acceptedText: { type: dataTypes.JSONB, allowNull: false },
			declinedText: { type: dataTypes.JSONB, allowNull: false },
			receivedEmailText: { type: dataTypes.JSONB, allowNull: false },
			introText: { type: dataTypes.JSONB, allowNull: false },
			targetEmailAddresses: { type: dataTypes.JSONB, allowNull: false, defaultValue: [] },
			requireAbstract: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
			requireDescription: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		},
		{
			tableName: 'SubmissionWorkflows',
			classMethods: {
				associate: (models) => {
					const { collection, submissionWorkflow, submission } = models;
					submissionWorkflow.hasMany(submission);
					submissionWorkflow.belongsTo(collection, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
