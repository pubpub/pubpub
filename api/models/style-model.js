const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const styleScheme = new Schema({
	title: { type: String },
	author: { type: ObjectId, ref: 'User'},

	styleDesktop: { type: String }, // Raw string as user input
	styleMobile: { type: String }, // Raw string as user input
	styleScoped: { type: String }, // CSS scoped to proper div

	createDate: { type: Date },
	lastUpdated: { type: Date },
});

module.exports = mongoose.model('Pub', styleScheme);
