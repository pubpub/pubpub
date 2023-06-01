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
				associate: ({ merge, ...models }) => {
					merge.belongsTo(models.user, { onDelete: 'CASCADE' });
					merge.belongsTo(models.pub, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
