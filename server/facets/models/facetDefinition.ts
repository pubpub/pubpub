export default (sequelize, dataTypes) => {
	return sequelize.define(
		'facetDefinition',
		{
			id: sequelize.idType,
			name: { type: dataTypes.TEXT, allowNull: false },
			structure: { typ: dataTypes.JSONB, allowNull: false },
		},
		{
			tableName: 'FacetDefinitions',
			classMethods: {
				associate: ({ facetDefinition, ...models }) => {
					facetDefinition.hasMany(models.facetInstance, {
						onDelete: 'CASCADE',
						as: 'instances',
						foreignKey: 'facetDefinitionId',
					});
				},
			},
		},
	);
};
