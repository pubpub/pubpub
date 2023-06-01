export default (sequelize, dataTypes) => {
	return sequelize.define(
		'customScript',
		{
			id: sequelize.idType,
			type: dataTypes.STRING,
			content: dataTypes.TEXT,
		},
		{
			tableName: 'CustomScripts',
			classMethods: {
				associate: ({ customScript, ...models }) => {
					customScript.belongsTo(models.community);
				},
			},
		},
	);
};
