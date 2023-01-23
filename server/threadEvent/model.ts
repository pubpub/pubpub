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
				associate: (models) => {
					const { user, threadEvent, thread } = models;
					threadEvent.belongsTo(thread, { foreignKey: { allowNull: false } });
					threadEvent.belongsTo(user, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
