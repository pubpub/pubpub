// When created, assets are stored as their own document (with this schema).
// They are also stored in the user's object under the 'Assets' field.
// All owners of an asset have the asset stored in their backend document.
// This allows us to display them in aggregate as a user navigates around the
// site, or from their profile page.

// Assets can be updated - each update stores all parts of the document needed
// to trace history (meta, url, filetype, etc).

// When used in pubs or discussions, the asset is inlined into markdown with
// its _id, and the version used.
// All data necessary to render the asset is included in text within the plugin when used.
// This allows the asset to be rendered without querying any of the asset documents.
// We query for the asset when deeper information (such as viewing versions, changing authors, etc)
// is needed.

// When a discussion or pub is submitted/published, we look at all the assets used
// and update those asset documents to mark which discussion or pub it was used in. For this
// we store both discussion/pub _id and the version.

// When as asset is cloned, a new asset is created with a blank history, but same asseType, label, and assetData.
// The parent field marks the _id and version of the asset from which it was cloned.
// The root field marks the _id of the furthest ancestor. This is used as a querying tool, so
// that finding the full lineage of an asset can simply query for all docs with the same root.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const assetSchema = new Schema({

	assetType: { type: String}, // PubPub asset type, e.g. image, video, data
	label: { type: String}, // Human-readable label. Used for drop-down selection, ordering, etc
	assetData: { type: Schema.Types.Mixed }, // User-input content about the asset.

	history: [{
		assetType: { type: String },
		label: { type: String },
		assetData: { type: Schema.Types.Mixed },
		updateDate: { type: Date },
	}],

	usedInDiscussions: [{
		id: { type: ObjectId, ref: 'Discussion' },
		version: { type: Number },
	}],
	usedInPubs: [{
		id: { type: ObjectId, ref: 'Pub' },
		version: { type: Number },
	}],

	parent: { // If cloned from an asset, this field stores which asset doc, and which version
		id: { type: ObjectId, ref: 'Asset' },
		version: { type: Number },
	},
	root: { type: ObjectId, ref: 'Asset' }, // Furthest ancestor - used as a query tool to grab entire lineage

	authors: [{ type: ObjectId, ref: 'User' }], // Authors have edit access to the asset

	createDate: { type: Date },
	lastUpdated: { type: Date },
});

assetSchema.statics.getAssetsPerPub = function(pubId, callback) {
	return this.find({'usedInPubs.id': pubId}).exec();
};

module.exports = mongoose.model('Asset', assetSchema);
