const passportLocalSequelize = require('passport-local-sequelize');

export default (sequelize, dataTypes) => {
	const user = sequelize.define(
		'user',
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
			firstName: { type: dataTypes.TEXT, allowNull: false },
			lastName: { type: dataTypes.TEXT, allowNull: false },
			fullName: { type: dataTypes.TEXT, allowNull: false },
			initials: { type: dataTypes.STRING, allowNull: false },
			avatar: dataTypes.TEXT,
			bio: dataTypes.TEXT,
			title: dataTypes.TEXT,
			email: {
				type: dataTypes.TEXT,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					isLowercase: true,
				},
			},
			publicEmail: {
				type: dataTypes.TEXT,
				validate: {
					isEmail: true,
					isLowercase: true,
				},
			},
			authRedirectHost: dataTypes.TEXT,
			location: dataTypes.TEXT,
			website: dataTypes.TEXT,
			facebook: dataTypes.TEXT,
			twitter: dataTypes.TEXT,
			github: dataTypes.TEXT,
			orcid: dataTypes.TEXT,
			googleScholar: dataTypes.TEXT,
			resetHashExpiration: dataTypes.DATE,
			resetHash: dataTypes.TEXT,
			inactive: dataTypes.BOOLEAN,
			pubpubV3Id: dataTypes.INTEGER,
			passwordDigest: dataTypes.TEXT,
			hash: { type: dataTypes.TEXT, allowNull: false },
			salt: { type: dataTypes.TEXT, allowNull: false },
			gdprConsent: { type: dataTypes.BOOLEAN, defaultValue: null },
			isSuperAdmin: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		},
		{
			tableName: 'Users',
			classMethods: {
				associate: (models) => {
					const {
						activityItem,
						pubAttribution,
						collectionAttribution,
						discussion,
						userNotificationPreferences,
						visibility,
						visibilityUser,
						zoteroIntegration,
					} = models;
					user.belongsToMany(visibility, { through: visibilityUser });
					user.hasMany(activityItem, { as: 'actor' });
					user.hasMany(collectionAttribution, {
						onDelete: 'CASCADE',
					});
					user.hasMany(pubAttribution, {
						onDelete: 'CASCADE',
						as: 'attributions',
						foreignKey: 'userId',
					});
					user.hasOne(zoteroIntegration, { allowNull: false });
					user.hasMany(discussion, { onDelete: 'CASCADE' });
					user.hasOne(userNotificationPreferences, { onDelete: 'CASCADE' });
				},
			},
		},
	);

	passportLocalSequelize.attachToUser(user, {
		usernameField: 'email',
		hashField: 'hash',
		saltField: 'salt',
		digest: 'sha512',
		iterations: 25000,
	});

	return user;
};
