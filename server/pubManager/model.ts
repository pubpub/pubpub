export default (sequelize) => {
	return sequelize.define(
		'pubManager',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'PubManagers',
			classMethods: {
				associate: ({ pubManager, ...models }) => {
					pubManager.belongsTo(models.pub, { foreignKey: { allowNull: false } });
					pubManager.belongsTo(models.user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
