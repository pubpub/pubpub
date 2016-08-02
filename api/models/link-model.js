const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const linkSchema = new Schema({
	type: { type: String },
	source: { type: ObjectId },
	destination: { type: ObjectId },

	createBy: { type: ObjectId, ref: 'User'},
	createDate: { type: Date },

	// metadata: { type: Schema.Types.Mixed },
	// metadata.collections: Used for Journal featured collections 
	metadata: {
		collections: [{ type: ObjectId, ref: 'Tag'}],
		rootReply: { type: ObjectId, ref: 'Atom'},
		yays: [{ type: ObjectId, ref: 'User'}],
		nays: [{ type: ObjectId, ref: 'User'}],
		roles: [{ type: Schema.Types.Mixed }],
	},

	inactive: { type: Boolean }, 
	inactiveBy: { type: ObjectId, ref: 'User'},
	inactiveDate: { type: Date },
	inactiveNote: { type: String },
	
});

linkSchema.statics.createLink = function(type, source, destination, createBy, createDate, metadata) {
	const newLink = new this({
		type: type,
		source: source,
		destination: destination,
		createBy: createBy,
		createDate: createDate || new Date().getTime(),
		metadata: metadata || {}
	});
	return newLink.save();
};

linkSchema.statics.setLinkInactive = function(type, source, destination, inactiveBy, inactiveDate, inactiveNote) {
	// Beacuse upsert is false, this will not create a new document if no match is found.
	return this.findOne({type: type, source: source, destination: destination, inactive: {$ne: true} }).exec()
	.then(function(linkResult) {
		if (!linkResult) { return undefined; }
		linkResult.inactive = true;
		linkResult.inactiveBy = inactiveBy;
		linkResult.inactiveDate = inactiveDate || new Date().getTime();
		linkResult.inactiveNote = inactiveNote;
		return linkResult.save();
	});
	
};

linkSchema.statics.setLinkInactiveById = function(id, inactiveBy, inactiveDate, inactiveNote) {
	// Beacuse upsert is false, this will not create a new document if no match is found.
	return this.findOne({_id: id, inactive: {$ne: true} }).exec()
	.then(function(linkResult) {
		console.log(linkResult);
		if (!linkResult) { return undefined; }
		linkResult.inactive = true;
		linkResult.inactiveBy = inactiveBy;
		linkResult.inactiveDate = inactiveDate || new Date().getTime();
		linkResult.inactiveNote = inactiveNote;
		return linkResult.save();
	});
	
};

module.exports = mongoose.model('Link', linkSchema);

// -------
// Types
// -------
// 
// USER -> PUB
// follower

// USER -> PUB
// author
// follower
// editor
// reader
// contributor

// USER -> JOURNAL
// admin
// follower

// PUB -> PUB
// reply
// clone
// lens
// cite
// embed
// source

// PUB -> JOURNAL
// submitted

// JOURNAL -> PUB
// featured

// -------
// Metadata
// -------
// reply
// 		rootReply
// 		yays
// 		nays
// 		
// featured
// 		collections
// 
// author, contributor, editor, reader
// 		roles
