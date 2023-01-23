export default (sequelize, dataTypes) => {
	return sequelize.define(
		'pubVersion',
		{
			id: sequelize.idType,
			historyKey: dataTypes.INTEGER,
		},
		{
			tableName: 'PubVersions',
			classMethods: {
				associate: (models) => {
					const { pubVersion, pub } = models;
					pubVersion.belongsTo(pub, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
