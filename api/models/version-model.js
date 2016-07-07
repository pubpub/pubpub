const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const versionSchema = new Schema({
	type: { type: String },
	hash: { type: String },
	message: { type: String },
	parent: { type: ObjectId, ref: 'Atom'},
	createdBy: { type: ObjectId, ref: 'User'},
	createDate: { type: Date },

	isPublished: { type: Boolean }, // True if this version is published
	content: { type: Schema.Types.Mixed },

});

module.exports = mongoose.model('Version', versionSchema);

// Document:
// -----------
// content: {
// 	markdown:
// 	style:
// }
// -----------

// Image:
// -----------
// content: {
// 	url:
// 	metadata:
// }
// -----------

// Jupyter:
// -----------
// content: {
// 	sourceUrl:
//	htmlUrl:
// }
// -----------
