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
				associate: ({ member, ...models }) => {
					member.belongsTo(models.user, { onDelete: 'CASCADE' });
					member.belongsTo(models.community, { onDelete: 'CASCADE' });
					member.belongsTo(models.pub, { onDelete: 'CASCADE' });
					member.belongsTo(models.collection, { onDelete: 'CASCADE' });
					member.belongsTo(models.organization);
				},
			},
		},
	);
};
