var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;


var journalSchema = new Schema({

	journalName: { type: String}, 
	subdomain: { type: String, required: true, index: true,  unique: true  },
	customDomain: { type: String, index: true,  unique: true, sparse: true  },
	description: { type: String },
	journalLogoURL: { type: String}, 
	backgroundImageURL: { type: String}, 
	colorScheme: { 
					'content-accent': { type: String}, 
					'header-background': { type: String}, 
					'header-text': { type: String}, 
					'header-accent': { type: String}, 
					'side-background': { type: String}, 
					'side-text': { type: String}, 
					'side-accent': { type: String}, 
				}, 
	cssURL: { type: String}, 
	language: { type: String}, 
	createDate: {type: Date},
	admins: [{ type: ObjectId, ref: 'User' }],

	pubsFeatured: [{ type: ObjectId, ref: 'Pub' }],
	pubsSubmitted: [{ type: ObjectId, ref: 'Pub' }],
	// We should eventually probably store 'owned' journals in the User model
});


module.exports = mongoose.model('Journal', journalSchema);