const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tagSchema = new Schema({
	title: { type: String },
	jrnl: { type: ObjectId, ref: 'Jrnl'},
	createDate: { type: Date },

});

module.exports = mongoose.model('Tag', tagSchema);
