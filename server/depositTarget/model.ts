export default (sequelize, dataTypes) => {
	return sequelize.define(
		'depositTarget',
		{
			id: sequelize.idType,
			doiPrefix: dataTypes.STRING,
			service: {
				type: dataTypes.ENUM,
				values: ['crossref', 'datacite'],
				defaultValue: 'crossref',
			},
			username: dataTypes.STRING,
			password: dataTypes.STRING,
			passwordInitVec: dataTypes.TEXT,
		},
		{
			tableName: 'DepositTargets',
			classMethods: {
				associate: (models) => {
					models.depositTarget.belongsTo(models.community);
				},
			},
		},
	);
};
