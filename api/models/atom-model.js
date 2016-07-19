const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const atomSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },
	title: { type: String },
	description: { type: String },
	previewImage: { type: String },
	type: { type: String },
	
	createDate: { type: Date },
	lastUpdated: { type: Date },
	isPublished: { type: Boolean }, // True if any version is published
	
	// language: { type: String }, // For search and sorting.

	versions: [{ type: ObjectId, ref: 'Version'}],

	inactive: { type: Boolean }, 
	inactiveDate: { type: Date },
	inactiveBy: { type: ObjectId, ref: 'User'},
	inactiveNote: { type: String },
	// tags: [{ type: String }],

});

module.exports = mongoose.model('Atom', atomSchema);

// Saving a version adds a new version.
// Saving a discussion creates new discussion, new version, new link, and adds that link to both items 'connections'
// On save version, we find all included atoms and create the links necessary
// When rendering a specific version, we query for Versions.find(hash)
// When rendering discussions, we query for connections({type: replyTo, destination: atomID})


// Links are never destroyed, only set inactive: true. This allows us to have a full record of all actions taken


// Link:
// createDate
// createdBy
// type (author, canEdit, canRead)
// source
// metadata
// destination
// inactive
// inactiveDate
// inactiveBy
// inactiveNote


// Submit to journal is link. Source is pub, destination is journal
// inactive without any pending feature means it's been denied.
// Querying for journals means finding all links with {type:{submittedTo or featuredby}, source: atomID}
// Or in the other direction, you can find all the pubs in a journal {type:{submittedTo or featuredby}, destination: journalID}

// Adding collaborator is a link. Source is author, destination is pub
// inactive means their role has switched or they've been removed.
