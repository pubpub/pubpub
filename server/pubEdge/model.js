export default (sequelize, dataTypes) => {
	return sequelize.define(
		'PubEdge',
		{
			pubId: { type: dataTypes.UUID, allowNull: false },
			targetForeignPublication: { type: dataTypes.UUID, allowNull: true },
			targetPubId: { type: dataTypes.UUID, allowNull: true },
			relationType: { type: dataTypes.STRING, allowNull: false },
			rank: { type: dataTypes.TEXT, allowNull: false },
			pubIsParent: { type: dataTypes.BOOLEAN, allowNull: false },
			approvedByTarget: { type: dataTypes.BOOLEAN, allowNull: false },
		},
		{
			classMethods: {
				associate: ({ PubEdge, Pub, ForeignPublication }) => {
					PubEdge.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'pub',
						foreignKey: 'pubId',
					});
					PubEdge.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'targetPub',
						foreignKey: 'targetPubId',
					});
					PubEdge.belongsTo(ForeignPublication, {
						onDelete: 'CASCADE',
						as: 'foreignPublication',
						foreignKey: 'foreignPublicationId',
					});
				},
			},
		},
	);
};
