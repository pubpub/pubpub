export default (sequelize, dataTypes) => {
	return sequelize.define(
		'doc',
		{
			id: sequelize.idType,
			content: { type: dataTypes.JSONB, allowNull: false },
		},
		{ tableName: 'Docs' },
	);
};
