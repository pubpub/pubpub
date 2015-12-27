var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var Heroku = require('heroku-client');
var heroku = undefined;

if(process.env.NODE_ENV !== 'production'){
	import {herokuApiKey} from '../authentication/herokuCredentials';	
	heroku = new Heroku({ token: herokuApiKey });
}else{
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
}

var journalSchema = new Schema({

	journalName: { type: String}, 
	subdomain: { type: String, required: true, index: true,  unique: true  },
	customDomain: { type: String, index: true,  unique: true, sparse: true  },
	journalLogoURL: { type: String}, 
	journalLogoThumbnailURL: { type: String}, 

	defaultLanguage: { type: String}, 
	createDate: {type: Date},
	
	admins: [{ type: ObjectId, ref: 'User' }],

	pubsFeatured: [{ type: ObjectId, ref: 'Pub' }],
	pubsSubmitted: [{ type: ObjectId, ref: 'Pub' }],
	
	design: { type: Schema.Types.Mixed },
	settings: { type: Schema.Types.Mixed },

	collections: [{
		description: { type: String},
		slug: {type: String},
		title: { type: String}, 
		pubs: [{ type: ObjectId, ref: 'Pub' }],
	}],

});

journalSchema.statics.updateHerokuDomains = function (oldDomain, newDomain) {
	heroku.delete('/apps/immense-escarpment-3653/domains/' + oldDomain, function (err, app) {
		if (err) {console.log(err);}
		heroku.post('/apps/immense-escarpment-3653/domains', { hostname: newDomain }, function (err, app) {
			if (err) {console.log(err);}
			console.log('New domain succesfully added');
		});
	});
};

module.exports = mongoose.model('Journal', journalSchema);
