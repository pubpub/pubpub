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
				associate: (models) => {
					const { publicPermissions, pub, collection, community, organization } = models;
					publicPermissions.belongsTo(pub, { onDelete: 'CASCADE' });
					publicPermissions.belongsTo(collection);
					publicPermissions.belongsTo(community);
					publicPermissions.belongsTo(organization);
				},
			},
		},
	);
};
