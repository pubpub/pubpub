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
				associate: ({ threadUser, ...models }) => {
					threadUser.belongsTo(models.user, { onDelete: 'CASCADE' });
					threadUser.belongsTo(models.thread, { foreignkey: { allowNull: false } });
				},
			},
		},
	);
};
