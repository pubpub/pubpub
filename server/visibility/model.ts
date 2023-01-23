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
				associate: (models) => {
					const { visibility, visibilityUser, user, discussion } = models;
					visibility.belongsToMany(user, { through: visibilityUser });
					visibility.hasMany(discussion, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
