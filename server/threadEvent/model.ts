export default (sequelize, dataTypes) => {
	return sequelize.define(
		'threadEvent',
		{
			id: sequelize.idType,
			type: dataTypes.STRING,
			data: dataTypes.JSONB,
		},
		{
			tableName: 'ThreadEvents',
			classMethods: {
				associate: ({ threadEvent, ...models }) => {
					threadEvent.belongsTo(models.thread, { foreignKey: { allowNull: false } });
					threadEvent.belongsTo(models.user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
