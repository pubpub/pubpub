import { DataTypes as dataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export const Collection = sequelize.defineSafe(
	'Collection',
	{
		id: sequelize.idType,
		title: { type: dataTypes.TEXT },
		slug: {
			type: dataTypes.TEXT,
			allowNull: false,
			validate: {
				isLowercase: true,
				len: [1, 280],
				is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and underscores and hyphens
			},
		},
		avatar: { type: dataTypes.TEXT },
		isRestricted: {
			type: dataTypes.BOOLEAN,
		} /* Restricted collections can only be set by Community Admins */,
		isPublic: { type: dataTypes.BOOLEAN } /* Only visible to community admins */,
		viewHash: { type: dataTypes.STRING },
		editHash: { type: dataTypes.STRING },
		metadata: { type: dataTypes.JSONB },
		kind: { type: dataTypes.TEXT },
		doi: { type: dataTypes.TEXT },
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
		/** Set by Associations */
		pageId: { type: dataTypes.UUID } /* Used to link a collection to a specific page */,
		communityId: { type: dataTypes.UUID },
		scopeSummaryId: { type: dataTypes.UUID, allowNull: true },
	},
	{
		associations: {
			collectionPubs: {
				model: 'CollectionPub',
				association: 'hasMany',

				foreignKey: 'collectionId',
			},
		},
	},
);

export type CollectionAttributes = typeof Collection.inferNonAssociationsType;

const collection = await Collection.create({
	readNextPreviewSize: 'mi',
});

let veryDeepPub = collection?.collectionPubs[0]?.collection?.collectionPubs[0]?.pub;
//  ^?
