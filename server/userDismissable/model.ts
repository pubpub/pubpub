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
				associate: (models) => {
					const { user, userDismissable } = models;
					userDismissable.belongsTo(user, { foreignKey: { allowNull: false } });
				},
			},
			indexes: [{ fields: ['userId'], method: 'BTREE' }],
		},
	);
};
