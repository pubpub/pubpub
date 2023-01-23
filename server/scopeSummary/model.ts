export default (sequelize, dataTypes) => {
	return sequelize.define(
		'scopeSummary',
		{
			id: sequelize.idType,
			collections: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			pubs: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			discussions: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			reviews: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			submissions: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		},
		{ tableName: 'ScopeSummaries' },
	);
};
