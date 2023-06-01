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
				associate: ({ reviewEvent, ...models }) => {
					reviewEvent.belongsTo(models.user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					reviewEvent.belongsTo(models.pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					reviewEvent.belongsTo(models.reviewNew, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
