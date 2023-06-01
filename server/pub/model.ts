export default (sequelize, dataTypes) => {
	return sequelize.define(
		'pub',
		{
			id: sequelize.idType,
			slug: {
				type: dataTypes.TEXT,
				unique: true,
				allowNull: false,
				validate: {
					isLowercase: true,
					len: [1, 280],
					is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and underscores and hyphens
				},
			},
			title: { type: dataTypes.TEXT, allowNull: false },
			htmlTitle: { type: dataTypes.TEXT, allowNull: true },
			description: {
				type: dataTypes.TEXT,
				validate: {
					len: [0, 280],
				},
			},
			htmlDescription: {
				type: dataTypes.TEXT,
				validate: {
					len: [0, 280],
				},
			},
			avatar: dataTypes.TEXT,
			headerStyle: {
				type: dataTypes.ENUM,
				values: ['white-blocks', 'black-blocks', 'dark', 'light'],
				defaultValue: null,
			},
			headerBackgroundColor: dataTypes.STRING,
			headerBackgroundImage: dataTypes.TEXT,
			firstPublishedAt: dataTypes.DATE,
			lastPublishedAt: dataTypes.DATE,
			customPublishedAt: dataTypes.DATE,
			doi: dataTypes.TEXT,
			labels: dataTypes.JSONB,
			downloads: dataTypes.JSONB,
			metadata: dataTypes.JSONB,
			licenseSlug: { type: dataTypes.TEXT, defaultValue: 'cc-by' },
			citationStyle: { type: dataTypes.TEXT, defaultValue: 'apa-7' },
			citationInlineStyle: { type: dataTypes.TEXT, defaultValue: 'count' },
			viewHash: dataTypes.STRING,
			editHash: dataTypes.STRING,
			reviewHash: dataTypes.STRING,
			commentHash: dataTypes.STRING,
			nodeLabels: dataTypes.JSONB,
			pubEdgeListingDefaultsToCarousel: {
				type: dataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			pubEdgeDescriptionVisible: {
				type: dataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			facetsMigratedAt: {
				type: dataTypes.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'Pubs',
			indexes: [{ fields: ['communityId'], method: 'BTREE' }],
			classMethods: {
				associate: ({ pub, ...models }) => {
					pub.belongsTo(models.draft, { foreignKey: { allowNull: false } });
					pub.hasMany(models.activityItem);
					pub.hasMany(models.pubAttribution, {
						onDelete: 'CASCADE',
						as: 'attributions',
						foreignKey: 'pubId',
					});
					pub.hasMany(models.collectionPub, {
						onDelete: 'CASCADE',
						hooks: true,
					});
					pub.belongsTo(models.community, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					pub.hasMany(models.discussion, { onDelete: 'CASCADE' });
					pub.hasMany(models.landingPageFeature, { onDelete: 'CASCADE' });
					pub.hasMany(models.models.export);
					pub.hasMany(models.reviewNew, {
						onDelete: 'CASCADE',
						as: 'reviews',
					});
					pub.hasMany(models.member, {
						onDelete: 'CASCADE',
						as: 'members',
						foreignKey: 'pubId',
					});
					pub.hasMany(models.release, { onDelete: 'CASCADE' });
					pub.hasMany(models.pubVersion, { onDelete: 'CASCADE' });
					pub.hasMany(models.pubEdge, {
						onDelete: 'CASCADE',
						as: 'outboundEdges',
						foreignKey: 'pubId',
					});
					pub.hasMany(models.pubEdge, {
						onDelete: 'CASCADE',
						as: 'inboundEdges',
						foreignKey: 'targetPubId',
					});
					pub.hasOne(models.submission);
					pub.belongsTo(models.crossrefDepositRecord);
					pub.belongsTo(models.scopeSummary);
				},
			},
		},
	);
};
