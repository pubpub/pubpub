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
				// alias to exportModel as export is a keyword
				associate: ({ export: exportModel, ...models }) => {
					exportModel.belongsTo(models.workerTask);
					exportModel.belongsTo(models.pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
