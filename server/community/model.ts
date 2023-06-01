export default (sequelize, dataTypes) => {
	return sequelize.define(
		'community',
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
			citeAs: dataTypes.TEXT,
			publishAs: dataTypes.TEXT,
			description: {
				type: dataTypes.TEXT,
				validate: {
					len: [0, 280],
				},
			},
			avatar: dataTypes.TEXT,
			favicon: dataTypes.TEXT,
			accentColorLight: dataTypes.STRING,
			accentColorDark: dataTypes.STRING,
			hideCreatePubButton: dataTypes.BOOLEAN,
			headerLogo: dataTypes.TEXT,
			headerLinks: dataTypes.JSONB,
			headerColorType: {
				type: dataTypes.ENUM,
				values: ['light', 'dark', 'custom'],
				defaultValue: 'dark',
			},
			useHeaderTextAccent: dataTypes.BOOLEAN,
			hideHero: dataTypes.BOOLEAN,
			hideHeaderLogo: dataTypes.BOOLEAN,
			heroLogo: dataTypes.TEXT,
			heroBackgroundImage: dataTypes.TEXT,
			heroBackgroundColor: dataTypes.TEXT,
			heroTextColor: dataTypes.TEXT,
			useHeaderGradient: dataTypes.BOOLEAN,
			heroImage: dataTypes.TEXT,
			heroTitle: dataTypes.TEXT,
			heroText: dataTypes.TEXT,
			heroPrimaryButton: dataTypes.JSONB,
			heroSecondaryButton: dataTypes.JSONB,
			heroAlign: dataTypes.TEXT,
			navigation: dataTypes.JSONB,
			hideNav: dataTypes.BOOLEAN,

			navLinks: dataTypes.JSONB,
			footerLinks: dataTypes.JSONB,
			footerLogoLink: dataTypes.TEXT,
			footerTitle: dataTypes.TEXT,
			footerImage: dataTypes.TEXT,

			website: dataTypes.TEXT,
			facebook: dataTypes.TEXT,
			twitter: dataTypes.TEXT,
			email: dataTypes.TEXT,
			issn: dataTypes.TEXT,
			isFeatured: dataTypes.BOOLEAN,
			viewHash: dataTypes.STRING,
			editHash: dataTypes.STRING,
			premiumLicenseFlag: { type: dataTypes.BOOLEAN, defaultValue: false },
			defaultPubCollections: dataTypes.JSONB,
		},
		{
			tableName: 'Communities',
			classMethods: {
				associate: ({ community, ...models }) => {
					community.hasMany(models.activityItem, { foreignKey: { allowNull: false } });
					community.hasMany(models.landingPageFeature, { onDelete: 'CASCADE' });
					community.belongsTo(models.organization, { onDelete: 'CASCADE' });
					community.hasMany(models.collection, { onDelete: 'CASCADE' });
					community.hasMany(models.pub, { onDelete: 'CASCADE' });
					community.hasMany(models.page, { onDelete: 'CASCADE' });
					community.hasMany(models.depositTarget, { onDelete: 'CASCADE' });
					community.belongsTo(models.scopeSummary);
					community.belongsTo(models.spamTag);
				},
			},
		},
	);
};
