export default (sequelize, dataTypes) => {
	return sequelize.define(
		'page',
		{
			id: sequelize.idType,
			title: { type: dataTypes.TEXT, allowNull: false },
			slug: { type: dataTypes.TEXT, allowNull: false },
			description: dataTypes.TEXT,
			avatar: dataTypes.TEXT,
			isPublic: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
			isNarrowWidth: dataTypes.BOOLEAN,
			viewHash: dataTypes.TEXT,
			layout: { type: dataTypes.JSONB, allowNull: false },
			layoutAllowsDuplicatePubs: {
				type: dataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			tableName: 'Pages',
			classMethods: {
				associate: ({ page, ...models }) => {
					page.belongsTo(models.community, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
