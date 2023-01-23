export default (sequelize, dataTypes) => {
	return sequelize.define(
		'crossrefDepositRecord',
		{
			id: sequelize.idType,
			depositJson: dataTypes.JSONB,
		},
		{ tableName: 'CrossrefDepositRecords' },
	);
};
