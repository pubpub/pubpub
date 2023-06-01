export default (sequelize, dataTypes) => {
	return sequelize.define(
		'signup',
		{
			id: sequelize.idType,
			email: {
				type: dataTypes.TEXT,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					isLowercase: true,
				},
			},
			hash: dataTypes.TEXT,
			count: dataTypes.INTEGER,
			completed: dataTypes.BOOLEAN,
		},
		{
			tableName: 'Signups',
			classMethods: {
				associate: ({ signup, ...models }) => {
					signup.belongsTo(models.community);
				},
			},
		},
	);
};
