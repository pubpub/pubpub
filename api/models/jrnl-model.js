const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const jrnlSchema = new Schema({

	jrnlName: { type: String },
	slug: { type: String, required: true, index: true, unique: true },
	description: { type: String },
	logo: { type: String }, // Full size for use on header
	icon: { type: String }, // Square image for use on searches, preview cards

	about: { type: String }, 
	website: { type: String }, 
	twitter: { type: String }, 
	facebook: { type: String }, 

	headerMode: { type: String }, // 'title', 'logo', 'both' 
	headerAlign: { type: String }, // 'left', 'center'
	headerColor: { type: String }, 
	headerImage: { type: String }, 

	collections: [{ type: ObjectId, ref: 'Tag'}],

	// language: { type: String }, // For search and sorting.	

	createDate: { type: Date },

	inactive: { type: Boolean }, 
	inactiveDate: { type: Date },
	inactiveBy: { type: ObjectId, ref: 'User'},
	inactiveNote: { type: String },

});

module.exports = mongoose.model('Jrnl', jrnlSchema);
