const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Heroku = require('heroku-client');
let heroku = undefined;

if (process.env.NODE_ENV !== 'production') {
	const herokuApiKey = require('../config').herokuApiKey;
	heroku = new Heroku({ token: herokuApiKey });
} else {
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
}

const journalSchema = new Schema({

	journalName: { type: String},
	subdomain: { type: String, required: true, index: true, unique: true },
	customDomain: { type: String, index: true, unique: true, sparse: true },
	journalLogoURL: { type: String},
	journalLogoThumbnailURL: { type: String},
	journalDescription: { type: String},

	defaultLanguage: {type: String},
	createDate: {type: Date},

	admins: [{ type: ObjectId, ref: 'User' }],

	pubsFeatured: [{ type: ObjectId, ref: 'Pub' }],
	pubsSubmitted: [{ type: ObjectId, ref: 'Pub' }],

	autoFeature: { type: Boolean },

	design: { type: Schema.Types.Mixed },
	landingPage: { type: ObjectId, ref: 'Pub' },
	locale: {type: String}, // Two character identifier for language pack, e.g 'en', 'es', etc.
	customLanguageMessages: {type: String}, // A JSON.stringify object that will be parsed and merged with base locale messages.

	settings: { type: Schema.Types.Mixed },

	collections: [{
		description: { type: String},
		slug: {type: String},
		title: { type: String},
		pubs: [{ type: ObjectId, ref: 'Pub' }],
		headerImage: { type: String},
	}],

	followers: [{ type: ObjectId, ref: 'User' }],

});

journalSchema.statics.isUnique = function(subdomain, callback) {

	this.findOne({subdomain: subdomain})
	.exec(function(err, journal) {
		if (err) return callback(err);
		// if (err) return res.json(500);

		if (journal !== null) { // We found a journal
			return callback(null, false);  // False - is not unique
		}
		// We did not find a pub
		return callback(null, true); // True -  is unique.
	});
};

journalSchema.statics.findByHost = function(host, callback) {
	this.findOne({ $or: [ {subdomain: host.split('.')[0]}, {customDomain: host}]})
	.exec(function(err, journal) {
		return callback(err, journal);
	});
};

journalSchema.statics.updateHerokuDomains = function(oldDomain, newDomain) {
	heroku.delete('/apps/pubpub/domains/' + oldDomain, function(err, app) {
		if (err) {console.log(err);}
		heroku.post('/apps/pubpub/domains', { hostname: newDomain }, function(errHerokuPost, appHerokuPost) {
			if (errHerokuPost) {console.log(errHerokuPost);}
			console.log('New domain succesfully added');
		});
	});
};

journalSchema.statics.populationObject = function(collectionsOnly, pubsOnly) {
	const options = [
		{path: 'landingPage', select: 'markdown styleScoped'},

		{path: 'pubsSubmitted', select: 'title abstract slug settings createDate lastUpdated'},
		{path: 'admins', select: 'name firstName lastName username thumbnail'},
		{
			path: 'pubsFeatured',
			select: 'title abstract slug authors lastUpdated createDate discussions createDate lastUpdated',
			populate: [
				{
					path: 'authors',
					model: 'User',
					select: 'name firstName lastName username thumbnail',
				},
			],
		},
		{
			path: 'collections.pubs',
			select: 'title abstract slug authors lastUpdated createDate discussions createDate lastUpdated',
			populate: [
				{
					path: 'authors',
					model: 'User',
					select: 'name firstName lastName username thumbnail',
				},
			],
		}
	];
	let output = options;
	if (collectionsOnly) {
		output = [options[4]];
	}
	if (pubsOnly) {
		output = [options[3]];
	}
	return output;
};

module.exports = mongoose.model('Journal', journalSchema);
