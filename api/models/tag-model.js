const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tagSchema = new Schema({
	title: { type: String },
	journal: { type: ObjectId, ref: 'Journal'},
	createDate: { type: Date },

	inactive: { type: Boolean }, 
	inactiveBy: { type: ObjectId, ref: 'User'},
	inactiveDate: { type: Date },
	inactiveNote: { type: String },
});

module.exports = mongoose.model('Tag', tagSchema);
