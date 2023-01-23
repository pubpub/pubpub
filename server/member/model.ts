export default (sequelize, dataTypes) => {
	return sequelize.define(
		'member',
		{
			id: sequelize.idType,
			permissions: {
				type: dataTypes.ENUM,
				values: ['view', 'edit', 'manage', 'admin'],
				defaultValue: 'view',
			},
			isOwner: dataTypes.BOOLEAN,
			subscribedToActivityDigest: {
				type: dataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			tableName: 'Members',
			classMethods: {
				associate: (models) => {
					const { member, user, collection, community, pub, organization } = models;
					member.belongsTo(user, { onDelete: 'CASCADE' });
					member.belongsTo(community, { onDelete: 'CASCADE' });
					member.belongsTo(pub, { onDelete: 'CASCADE' });
					member.belongsTo(collection, { onDelete: 'CASCADE' });
					member.belongsTo(organization);
				},
			},
		},
	);
};
