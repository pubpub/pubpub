export default (sequelize, dataTypes) => {
	return sequelize.define(
		'collectionPub',
		{
			id: sequelize.idType,
			contextHint: dataTypes.TEXT,
			rank: { type: dataTypes.TEXT, allowNull: false },
			pubRank: { type: dataTypes.TEXT, allowNull: false },
		},
		{
			tableName: 'CollectionPubs',
			indexes: [
				// Index to enforce that there is one CollectionPub per (collection, pub) pair
				{
					fields: ['collectionId', 'pubId'],
					unique: true,
				},
			],
			classMethods: {
				associate: (models) => {
					const { collectionPub, collection, pub } = models;
					collectionPub.belongsTo(collection, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					collectionPub.belongsTo(pub, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
				},
			},
		},
	);
};
