export default (sequelize, dataTypes) => {
	return sequelize.define(
		'visibility',
		{
			id: sequelize.idType,
			access: {
				type: dataTypes.ENUM,
				values: ['private', 'members', 'public'],
				defaultValue: 'private',
			},
		},
		{
			tableName: 'Visibilities',
			classMethods: {
				associate: ({ visibility, ...models }) => {
					visibility.belongsToMany(models.user, { through: models.visibilityUser });
					visibility.hasMany(models.discussion, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
