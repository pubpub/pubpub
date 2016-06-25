const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const atomSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },
	title: { type: String },
	description: { type: String },
	previewImage: { type: String },
	
	authors: [{ type: ObjectId, ref: 'User'}],
	canEdit: [{ type: ObjectId, ref: 'User'}],
	canRead: [{ type: ObjectId, ref: 'User'}],
	followers: [{ type: ObjectId, ref: 'User'}],
	
	createDate: { type: Date },
	lastUpdated: { type: Date },
	versions: [{ type: ObjectId, ref: 'Version'}],
	isPublished: { type: Boolean },
	
	connections: [{ type: ObjectId, ref: 'Link'}],
	
	tags: [{ type: String }],

});

module.exports = mongoose.model('Atom', atomSchema);
