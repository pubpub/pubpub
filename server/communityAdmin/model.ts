export default (sequelize) => {
	return sequelize.define(
		'communityAdmin',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'CommunityAdmins',
			classMethods: {
				associate: (models) => {
					const { communityAdmin, user, community } = models;
					communityAdmin.belongsTo(user, { foreignKey: { allowNull: false } });
					communityAdmin.belongsTo(community, { foreignKey: { allowNull: false } });
				},
			},
		},
	);
};
