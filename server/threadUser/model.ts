export default (sequelize, dataTypes) => {
	return sequelize.define(
		'threadUser',
		{
			id: sequelize.idType,
			type: {
				type: dataTypes.ENUM,
				values: ['viewer', 'reviewer'],
				defaultValue: 'viewer',
			},
			email: {
				type: dataTypes.TEXT,
				validate: {
					isEmail: true,
					isLowercase: true,
				},
			},
			hash: dataTypes.TEXT,
		},
		{
			tableName: 'ThreadUsers',
			classMethods: {
				associate: (models) => {
					const { threadUser, user, thread } = models;
					threadUser.belongsTo(user, { onDelete: 'CASCADE' });
					threadUser.belongsTo(thread, { foreignkey: { allowNull: false } });
				},
			},
		},
	);
};
