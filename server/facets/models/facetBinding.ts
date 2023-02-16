export default (sequelize) => {
	return sequelize.define(
		'facetBinding',
		{
			id: sequelize.idType,
		},
		{
			tableName: 'FacetBindings',
			indexes: [
				{ fields: ['communityId'], method: 'BTREE' },
				{ fields: ['collectionId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
			],
			classMethods: {
				associate: (models) => {
					const { facetBinding, community, collection, pub } = models;
					facetBinding.belongsTo(community, {
						onDelete: 'CASCADE',
					});
					facetBinding.belongsTo(collection, {
						onDelete: 'CASCADE',
					});
					facetBinding.belongsTo(pub, {
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
};
