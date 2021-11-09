export default (sequelize, dataTypes) => {
	return sequelize.define(
		'SubmissionWorkflow',
		{
			id: sequelize.idType,
			enabled: { type: dataTypes.BOOLEAN, allowNull: false },
			instructions: { type: dataTypes.JSONB },
			afterSubmittedText: { type: dataTypes.JSONB },
			email: { type: dataTypes.JSONB },
			layoutBlock: {
				type: dataTypes.JSONB,
			},
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
