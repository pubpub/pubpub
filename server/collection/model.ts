export default (sequelize, dataTypes) => {
	return sequelize.define(
		'collection',
		{
			id: sequelize.idType,
			title: dataTypes.TEXT,
			slug: {
				type: dataTypes.TEXT,
				allowNull: false,
				validate: {
					isLowercase: true,
					len: [1, 280],
					is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and underscores and hyphens
				},
			},
			avatar: dataTypes.TEXT,
			isRestricted: dataTypes.BOOLEAN, // Restricted collections can only be set by Community Admins
			isPublic: dataTypes.BOOLEAN, // Only visible to community admins
			viewHash: dataTypes.STRING,
			editHash: dataTypes.STRING,
			metadata: dataTypes.JSONB,
			kind: dataTypes.TEXT,
			doi: dataTypes.TEXT,
			readNextPreviewSize: {
				type: dataTypes.ENUM('none', 'minimal', 'medium', 'choose-best'),
				defaultValue: 'choose-best',
			},
			layout: { type: dataTypes.JSONB, allowNull: false, defaultValue: {} },
			layoutAllowsDuplicatePubs: {
				type: dataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			tableName: 'Collections',
			classMethods: {
				associate: ({ collection, ...models }) => {
					collection.hasMany(models.activityItem);
					collection.hasMany(models.collectionPub);
					collection.hasMany(models.collectionAttribution, {
						onDelete: 'CASCADE',
						as: 'attributions',
						foreignKey: 'collectionId',
					});
					collection.belongsTo(models.crossrefDepositRecord);
					collection.hasMany(models.member);
					collection.belongsTo(models.page);
					collection.hasOne(models.submissionWorkflow);
					collection.belongsTo(models.scopeSummary);
				},
			},
		},
	);
};
