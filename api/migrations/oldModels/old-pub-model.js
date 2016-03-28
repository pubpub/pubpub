var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;
// var Discussion = require('../models').Discussion;
// var Notification = require('../models').Notification;
var _         = require('underscore');

import * as jsdiff from 'diff';

var pubSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },

	// --------------
	// --------------
	// The Items in this block are fozen at publish time.
	// All changes that are made pre-update-publish are stored and synced to firebase.
	// Their change has no reflection in the variables stored here.
	// This is to ensure that non-published updates don't leak into the Reader
	title: { type: String },
	abstract: { type: String },
	authorsNote: { type: String },
	markdown: { type: String }, //Preprocessed with comments describing all plugin options
	authors: [{ type: ObjectId, ref: 'User'}],
	assets: [{ type: ObjectId, ref: 'oldAsset'}], //Raw sources
	references: [{ type: ObjectId, ref: 'oldReference'}], //Raw 4s
	style: { type: Schema.Types.Mixed }, // Soon to be deprecated

	styleRawDesktop: { type: String }, // Raw string as user input
	styleRawMobile: { type: String }, // Raw string as user input
	styleScoped: { type: String }, // CSS scoped to proper div

	lastUpdated: { type: Date },
	status: { type: String },
	// --------------
	// --------------

	// A duplicate cache of the parameters as defined in the editor.
	// Also stored here so that we can privelege access to the editor
	// and to private pubs
	collaborators: {
		canEdit:[{ type: ObjectId, ref: 'User'}],
		canRead:[{ type: ObjectId, ref: 'User'}]
	},

	createDate: { type: Date },
	htmlCache: { type: String }, // Do we want to cache the html render? It might not be any faster...

	history: [{ //History is appended to each time a 'publish' is made.
		publishNote: { type: String },
		publishDate: { type: Date },
		publishAuthor: { type: ObjectId, ref: 'User'},
		diffObject: {
			additions:  { type: Number },
			deletions: { type: Number },
			diffTitle: [],
			diffAbstract: [],
			diffAuthorsNote: [],
			diffMarkdown: [],
			// diffAuthors: { type: String },
			// diffAssets: { type: String },
			// diffReferences: { type: String },
			// diffStyle: { type: String },
		},

		// The following should be enough to entirely reproduce the document
		title: { type: String },
		abstract: { type: String },
		authorsNote: { type: String },
		markdown: { type: String }, //Preprocessed with comments describing all plugin options
		authors: [{ type: ObjectId, ref: 'User'}],
		assets: [{ type: ObjectId, ref: 'oldAsset'}], //Raw sources
		references: [{ type: ObjectId, ref: 'oldReference'}], //Raw References
		style: { type: Schema.Types.Mixed }, // Soon to be deprecated

		styleRawDesktop: { type: String }, // Raw string as user input
		styleRawMobile: { type: String }, // Raw string as user input
		styleScoped: { type: String }, // CSS scoped to proper div

		status: { type: String },
	}],

	followers: [{ type: ObjectId, ref: 'User'}],

	settings:{
		pubPrivacy: { type: String },
	},

	featuredIn: [{
		journal: { type: ObjectId, ref: 'Journal' },
		date: { type: Date },
		by: { type: ObjectId, ref: 'User' },
		note: { type: String },
	}],
	featuredInList: [{type: ObjectId, ref: 'Journal' }],

	submittedTo: [{
		journal: { type: ObjectId, ref: 'Journal' },
		date: { type: Date },
		by: { type: ObjectId, ref: 'User' },
		note: { type: String },
	}],
	submittedToList: [{type: ObjectId, ref: 'Journal' }],

	reviews: [{
		doneWell: [{ type: String }],
		needsWork: [{ type: String }],
		reviewer: { type: ObjectId, ref: 'User' },
		// weightLocal: 245, // dynamically calculated based on yays/nays on pub comments
		// weightGlobal: 1230 // Snapshot of reputation at moment of review. static
	}],

	discussions: [ { type: ObjectId, ref: 'Discussion' } ],
	editorComments: [ { type: ObjectId, ref: 'Discussion' } ],
	experts: {
		approved: [{
			// When approved, experts are notified
			// If they have not participated in the paper,
			// their name does not appear in the list
			// We can sort 'invited' experts by those that
			// have been made an expert, but haven't participated.
			expert: { type: ObjectId, ref: 'User' },
			approvedBy: { type: ObjectId, ref: 'User' },
			approvedDate: { type: Date },
		}],
		suggested: [{
			suggestedExpert: { type: ObjectId, ref: 'User' },
			votes: [{ type: ObjectId, ref: 'User' }],
			submitter: { type: ObjectId, ref: 'User' },
			submitDate: { type: Date },
		}]
	},

	analytics: { //Do we cache these every so often? Or calculate them dynamically?
		views: [{ type: String }],
		citations: [{ type: ObjectId, ref: 'oldAsset' }], // A list of the refernce assets that cite it?
		inTheNews: [{ type: String }],
	},

	readNext: [{ type: ObjectId, ref: 'Pub' }], //Do we cache these every so often? Or calculate them dynamically?
})


module.exports = mongoose.model('oldPub', pubSchema, 'pubs');
