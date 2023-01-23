export default (sequelize) => {
	return sequelize.define(
		'userScopeVisit',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'UserScopeVisits',
			classMethods: {
				associate: (models) => {
					const { userScopeVisit, user, pub, collection, community } = models;
					userScopeVisit.belongsTo(user);
					userScopeVisit.belongsTo(pub);
					userScopeVisit.belongsTo(collection);
					userScopeVisit.belongsTo(community);
				},
			},
			indexes: [
				{
					unique: true,
					fields: ['userId', 'collectionId'],
				},
				{
					unique: true,
					fields: ['userId', 'pubId'],
				},
			],
		},
	);
};
