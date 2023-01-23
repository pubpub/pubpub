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
				associate: (models) => {
					const { doc, release, pub, user } = models;
					release.belongsTo(doc, { foreignKey: { allowNull: false } });
					release.belongsTo(user, { foreignKey: { allowNull: false } });
					release.belongsTo(pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
