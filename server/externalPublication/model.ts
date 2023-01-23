export default (sequelize, dataTypes) => {
	return sequelize.define(
		'externalPublication',
		{
			id: sequelize.idType,
			title: { type: dataTypes.TEXT, allowNull: false },
			url: { type: dataTypes.TEXT, allowNull: false },
			contributors: dataTypes.JSONB,
			doi: dataTypes.TEXT,
			description: dataTypes.TEXT,
			avatar: dataTypes.TEXT,
			publicationDate: dataTypes.DATE,
		},
		{ tableName: 'ExternalPublications' },
	);
};
