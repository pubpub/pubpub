export default (sequelize, dataTypes) => {
	return sequelize.define(
		'release',
		{
			id: sequelize.idType,
			noteContent: dataTypes.JSONB,
			noteText: dataTypes.TEXT,
			historyKey: { type: dataTypes.INTEGER, allowNull: false },
			historyKeyMissing: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		},
		{
			tableName: 'Releases',
			classMethods: {
				associate: ({ release, ...models }) => {
					release.belongsTo(models.doc, { foreignKey: { allowNull: false } });
					release.belongsTo(models.user, { foreignKey: { allowNull: false } });
					release.belongsTo(models.pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
