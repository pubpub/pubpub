export default (sequelize, dataTypes) => {
	return sequelize.define(
		'organization',
		{
			id: sequelize.idType,
			subdomain: {
				type: dataTypes.TEXT,
				unique: true,
				allowNull: false,
				validate: {
					isLowercase: true,
					len: [1, 280],
					is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and hyphens
				},
			},
			domain: {
				type: dataTypes.TEXT,
				unique: true,
			},
			title: { type: dataTypes.TEXT, allowNull: false },
			description: {
				type: dataTypes.TEXT,
				validate: {
					len: [0, 280],
				},
			},
			avatar: dataTypes.TEXT,
			favicon: dataTypes.TEXT,
		},
		{
			tableName: 'Organizations',
			classMethods: {
				associate: ({ organization, ...models }) => {
					organization.hasMany(models.community, { onDelete: 'CASCADE' });
				},
			},
		},
	);
};
