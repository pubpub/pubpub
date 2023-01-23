export default (sequelize, dataTypes) => {
	return sequelize.define(
		'workerTask',
		{
			id: sequelize.idType,
			type: { type: dataTypes.TEXT, allowNull: false },
			input: dataTypes.JSONB,
			isProcessing: dataTypes.BOOLEAN,
			attemptCount: dataTypes.INTEGER,
			error: dataTypes.JSONB,
			output: dataTypes.JSONB,
			priority: dataTypes.INTEGER,
		},
		{ tableName: 'WorkerTasks' },
	);
};
