export default (sequelize, dataTypes) => {
	return sequelize.define(
		'reviewEvent',
		{
			id: sequelize.idType,
			type: dataTypes.STRING,
			data: dataTypes.JSONB,
		},
		{
			tableName: 'ReviewEvents',
			classMethods: {
				associate: (models) => {
					const { user, reviewEvent, reviewNew, pub } = models;
					reviewEvent.belongsTo(user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					reviewEvent.belongsTo(pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					reviewEvent.belongsTo(reviewNew, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
