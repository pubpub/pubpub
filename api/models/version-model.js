const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const versionSchema = new Schema({
	type: { type: String },
	// hash: { type: String },
	message: { type: String },
	parent: { type: ObjectId, ref: 'Atom'},
	createdBy: { type: ObjectId, ref: 'User'},
	createDate: { type: Date },

	isPublished: { type: Boolean }, // True if this version is published
	publishedBy: { type: ObjectId, ref: 'User'},
	publishedDate: { type: Date },
	
	content: { type: Schema.Types.Mixed },

});

module.exports = mongoose.model('Version', versionSchema);

// Document:
// -----------
// content: {
//  docJSON:
// 	markdown:
// 	style:
//  markdownFile: 
//  PDFFile: 
//  XMLFile:
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
// 	url:
//	htmlUrl:
// }
// -----------

// PDF:
// -----------
// content: {
// 	url:
// }
// -----------

// Reference:
// -----------
// content: {
//  title 
//  url 
//  author 
//  journal 
//  volume 
//  number 
//  pages 
//  year 
//  publisher 
//  doi
//  note 
// -----------

// Highlight:
// -----------
// content: {
// 	text:
// 	context:
//  ancestorHash: 
// 	startContainerPath:
// 	startOffset:
//	endContainerPath:
// 	endOffset:
// 	sourcePub: 
// 	sourceVersion
// }
// -----------
