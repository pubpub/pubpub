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
				associate: ({ pubVersion, ...models }) => {
					pubVersion.belongsTo(models.pub, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
