export default (sequelize) => {
	return sequelize.define(
		'pubManager',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'PubManagers',
			classMethods: {
				associate: (models) => {
					const { pubManager, user, pub } = models;
					pubManager.belongsTo(pub, { foreignKey: { allowNull: false } });
					pubManager.belongsTo(user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
