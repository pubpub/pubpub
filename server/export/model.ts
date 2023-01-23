export default (sequelize, dataTypes) => {
	return sequelize.define(
		'export',
		{
			id: sequelize.idType,
			format: { type: dataTypes.STRING, allowNull: false },
			url: { type: dataTypes.STRING, allowNull: true },
			historyKey: { type: dataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'Exports',
			classMethods: {
				associate: (models) => {
					const { workerTask, pub } = models;
					models.export.belongsTo(workerTask);
					models.export.belongsTo(pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
