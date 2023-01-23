export default (sequelize) => {
	return sequelize.define(
		'visibilityUser',
		{
			id: sequelize.idType,
		},
		{ tableName: 'VisibilityUsers' },
	);
};
