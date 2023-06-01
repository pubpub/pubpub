export default (sequelize) => {
	return sequelize.define(
		'communityAdmin',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'CommunityAdmins',
			classMethods: {
				associate: ({ communityAdmin, ...models }) => {
					communityAdmin.belongsTo(models.user, { foreignKey: { allowNull: false } });
					communityAdmin.belongsTo(models.community, {
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
