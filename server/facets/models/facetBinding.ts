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
				associate: ({ facetBinding, ...models }) => {
					facetBinding.belongsTo(models.community, {
						onDelete: 'CASCADE',
					});
					facetBinding.belongsTo(models.collection, {
						onDelete: 'CASCADE',
					});
					facetBinding.belongsTo(models.pub, {
						onDelete: 'CASCADE',
					});
				},
			},
		},
	);
};
