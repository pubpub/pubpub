export default (sequelize, dataTypes) => {
	return sequelize.define(
		'publicPermissions',
		{
			id: sequelize.idType,
			canCreateReviews: dataTypes.BOOLEAN,
			canCreateDiscussions: dataTypes.BOOLEAN,
			canViewDraft: dataTypes.BOOLEAN,
			canEditDraft: dataTypes.BOOLEAN,
		},
		{
			tableName: 'PublicPermissions',
			classMethods: {
				associate: ({ publicPermissions, ...models }) => {
					publicPermissions.belongsTo(models.pub, { onDelete: 'CASCADE' });
					publicPermissions.belongsTo(models.collection);
					publicPermissions.belongsTo(models.community);
					publicPermissions.belongsTo(models.organization);
				},
			},
		},
	);
};
