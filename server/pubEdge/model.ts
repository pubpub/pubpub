export default (sequelize, dataTypes) => {
	return sequelize.define(
		'pubEdge',
		{
			id: sequelize.idType,
			relationType: { type: dataTypes.STRING, allowNull: false },
			rank: { type: dataTypes.TEXT, allowNull: false },
			pubIsParent: { type: dataTypes.BOOLEAN, allowNull: false },
			approvedByTarget: { type: dataTypes.BOOLEAN, allowNull: false },
		},
		{
			tableName: 'PubEdges',
			classMethods: {
				associate: ({ pubEdge, pub, externalPublication }) => {
					pubEdge.belongsTo(pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					pubEdge.belongsTo(pub, {
						onDelete: 'CASCADE',
						as: 'targetPub',
					});
					pubEdge.belongsTo(externalPublication, {
						onDelete: 'CASCADE',
						as: 'externalPublication',
					});
				},
			},
		},
	);
};
