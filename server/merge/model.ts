export default (sequelize, dataTypes) => {
	return sequelize.define(
		'merge',
		{
			id: sequelize.idType,
			noteContent: dataTypes.JSONB,
			noteText: dataTypes.TEXT,
		},
		{
			tableName: 'Merges',
			classMethods: {
				associate: (models) => {
					const { user, merge, pub } = models;
					merge.belongsTo(user, { onDelete: 'CASCADE' });
					merge.belongsTo(pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
