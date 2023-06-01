export default (sequelize, dataTypes) => {
	return sequelize.define(
		'userDismissable',
		{
			id: sequelize.idType,
			key: { type: dataTypes.STRING, allowNull: false },
		},
		{
			tableName: 'UserDismissables',
			classMethods: {
				associate: ({ userDismissable, ...models }) => {
					userDismissable.belongsTo(models.user, { foreignKey: { allowNull: false } });
				},
			},
			indexes: [{ fields: ['userId'], method: 'BTREE' }],
		},
	);
};
