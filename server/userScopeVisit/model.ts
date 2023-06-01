export default (sequelize) => {
	return sequelize.define(
		'userScopeVisit',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'UserScopeVisits',
			classMethods: {
				associate: ({ userScopeVisit, ...models }) => {
					userScopeVisit.belongsTo(models.user);
					userScopeVisit.belongsTo(models.pub);
					userScopeVisit.belongsTo(models.collection);
					userScopeVisit.belongsTo(models.community);
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
