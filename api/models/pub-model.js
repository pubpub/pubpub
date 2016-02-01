var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;
var Discussion = require('../models').Discussion;
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
	assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources
	references: [{ type: ObjectId, ref: 'Reference'}], //Raw References
	style: { type: Schema.Types.Mixed },
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
		assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources
		references: [{ type: ObjectId, ref: 'Reference'}], //Raw References
		style: { type: Schema.Types.Mixed },
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
		citations: [{ type: ObjectId, ref: 'Asset' }], // A list of the refernce assets that cite it?
		inTheNews: [{ type: String }],
	},

	readNext: [{ type: ObjectId, ref: 'Pub' }], //Do we cache these every so often? Or calculate them dynamically?
})


pubSchema.statics.isUnique = function (slug,callback) {

	this.findOne({'slug':slug})
	.exec(function (err, pub) {
			if (err) return callback(err);
			// if (err) return res.json(500);

			if(pub!=null){ //We found a pub
				return callback(null,false);  //False - is not unique
			}else{ //We did not find a pub
				return callback(null,true) //True -  is unique.
			}
		});
};

pubSchema.statics.getSimplePub = function (id,callback) {
	this.findById(id)
	.exec((err, pub)=> {
		callback(err,pub);
	});


};


pubSchema.statics.getPub = function (slug, readerID, journalID, callback) {
	this.findOne({slug: slug})
	.populate({ path: 'discussions', model: 'Discussion' })
	.populate({ path: 'assets history.assets', model: 'Asset' })
	.populate({ path: 'references history.references', model: 'Reference' })
	.populate({ path: 'featuredIn.journal submittedTo.journal', select: 'journalName subdomain customDomain design', model: 'Journal' })
	.populate({ path: 'authors history.authors', select: 'username name thumbnail firstName lastName', model: 'User' })
	.exec((err, pub)=> {
		const options = [
			{ path: 'discussions.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
			{ path: 'discussions.selections', model: 'Highlight'}
		];

		this.populate(pub, options, (err, populatedPub)=> {
			if (err) { return callback(err, null); }

			if (!populatedPub) { return callback(null, {message: 'Pub Not Found', slug: slug}); }

			// Check if the pub is not allowed in the journal
			if (journalID && String(populatedPub.featuredInList).indexOf(journalID) === -1 && String(populatedPub.submittedToList).indexOf(journalID) === -1) {
				return callback(null, {message: 'Pub not in this journal', slug: slug});
			}

			if (populatedPub.status === 'Unpublished') { return callback(null, {message: 'Pub not yet published', slug: slug}); }

			// Check if the pub is private, and if so, check readers/authors list
			// if (populatedPub.settings.pubPrivacy === 'private') {
			// 	if (populatedPub.collaborators.canEdit.indexOf(readerID) === -1 && populatedPub.collaborators.canRead.indexOf(readerID) === -1) {
			// 		return callback(null, {message: 'Private Pub', slug: slug});
			// 	}
			// }

			const outputPub = populatedPub.toObject();
			if (populatedPub.collaborators.canEdit.indexOf(readerID) > -1) {
				outputPub.isAuthor = true;
			}

			outputPub.discussions = Discussion.appendUserYayNayFlag(outputPub.discussions, readerID);
			outputPub.discussions = Discussion.calculateYayNayScore(outputPub.discussions);
			outputPub.discussions = Discussion.sortDiscussions(outputPub.discussions);
			outputPub.discussions = Discussion.nestChildren(outputPub.discussions);
			// console.log(outputPub.isAuthor);
			return callback(null, outputPub);
		});

	})
};

pubSchema.statics.getPubEdit = function (slug, readerID, readerGroups, callback) {
	// Get the pub and check to make sure user is authorized to edit
	this.findOne({slug: slug})
	.populate({ path: 'discussions', model: 'Discussion' })
	.populate({ path: 'editorComments', model: 'Discussion' })
	.exec((err, pub) =>{
		if (err) { return callback(err, null); }

		if (!pub) { return callback(null, 'Pub Not Found', true); }

		if (!readerID) { return callback(null, 'Not Authorized', true); }

		const readerGroupsStrings = readerGroups.length ? readerGroups.toString().split(',') : [];
		const canReadStrings = pub.collaborators.canRead.length ? pub.collaborators.canRead.toString().split(',') : [];
		const canEditStrings = pub.collaborators.canEdit.length ? pub.collaborators.canEdit.toString().split(',') : [];

		if (canEditStrings.indexOf(readerID.toString()) === -1 && 
			canReadStrings.indexOf(readerID.toString()) === -1 && 
			_.intersection(readerGroupsStrings, canEditStrings).length === 0 && 
			_.intersection(readerGroupsStrings, canReadStrings).length === 0) {
			return callback(null, 'Not Authorized', true);
		}

		let isReader = true;
		if (canEditStrings.indexOf(readerID.toString()) > -1 || _.intersection(readerGroupsStrings, canEditStrings).length) {
			isReader = false;
		}

		// Once authorized, it doesn't seem like we need to provide any data to the editor
		// That will likely change when we implement better authentication for the firepad
		// This will change when we have to pass down status to the editor. Once you publish peer-review-ready
		// You can go and publish draft...

		// We gotta pass down discussions if we want to show in editor
		const options = [
			{ path: 'discussions.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
			{ path: 'discussions.selections', model: 'Highlight'},
			{ path: 'editorComments.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
			{ path: 'editorComments.selections', model: 'Highlight'},
		];

		this.populate(pub, options, (err, populatedPub)=> {
			if (err) { return callback(err, null); }
			const outputPub = populatedPub.toObject();
			outputPub.isReader = isReader;

			outputPub.discussions = Discussion.appendUserYayNayFlag(outputPub.discussions, readerID);
			outputPub.discussions = Discussion.calculateYayNayScore(outputPub.discussions);
			outputPub.discussions = Discussion.sortDiscussions(outputPub.discussions);
			outputPub.discussions = Discussion.nestChildren(outputPub.discussions);

			outputPub.editorComments = Discussion.appendUserYayNayFlag(outputPub.editorComments, readerID);
			outputPub.editorComments = Discussion.calculateYayNayScore(outputPub.editorComments);
			outputPub.editorComments = Discussion.sortDiscussions(outputPub.editorComments);
			outputPub.editorComments = Discussion.nestChildren(outputPub.editorComments);

			return callback(null, outputPub);
		});

		// return callback(null, {});

	});

};

pubSchema.statics.generateDiffObject = function(oldPubObject, newPubObject) {

	const t0 = new Date();
	const outputObject = {};
	outputObject.diffTitle = jsdiff.diffWords(oldPubObject.title, newPubObject.title, {newlineIsToken: true});
	outputObject.diffAbstract = jsdiff.diffWords(oldPubObject.abstract, newPubObject.abstract, {newlineIsToken: true});
	outputObject.diffAuthorsNote = jsdiff.diffWords(oldPubObject.authorsNote, newPubObject.authorsNote, {newlineIsToken: true});
	if (newPubObject.slug === 'cdmxglobal') {
		outputObject.diffMarkdown = jsdiff.diffSentences(oldPubObject.markdown, newPubObject.markdown, {newlineIsToken: true});
	} else {
		outputObject.diffMarkdown = jsdiff.diffWords(oldPubObject.markdown, newPubObject.markdown, {newlineIsToken: true});
	}



	let additions = 0;
	let deletions = 0;
	for (const key in outputObject) {
		outputObject[key].map((diffArrayItem)=>{
			if (diffArrayItem.added) {
				additions += 1;
			}
			if (diffArrayItem.removed) {
				deletions += 1;
			}
		});
	}

	outputObject.additions = additions;
	outputObject.deletions = deletions;
	const t1 =  new Date() - t0;
	// console.info("Execution time: %dms", t1);
	// console.log('outputObject', outputObject);

	return outputObject;

};

pubSchema.statics.addJournalFeatured = function(pubID, journalID, adminID) {
	const featureObject = {
		journal: journalID,
		date: new Date().getTime(),
		by: adminID,
	};
	this.update({ _id: pubID }, { $addToSet: { 'featuredInList': journalID, 'featuredIn': featureObject} }, function(err, result){if(err) console.log('Error in addJournalFeatured ', err);});
};

pubSchema.statics.addJournalSubmitted = function(pubID, journalID, userID) {
	const submittedObject = {
		journal: journalID,
		date: new Date().getTime(),
		by: userID,
	};
	this.update({ _id: pubID }, { $addToSet: { 'submittedToList': journalID, 'submittedTo': submittedObject} }, function(err, result){if(err) console.log('Error in addJournalSubmitted ', err);});
};

pubSchema.statics.getRandomSlug = function(journalID, callback) {
	var objects = [];
	var query = {history: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};
	if(journalID){
		query['featuredInList'] = journalID;
	}

	this.count(query, {'slug':1}).exec((err, count)=> {
		if (err){ return callback(err, null); }

		const skip = Math.floor(Math.random()*count);

		this.find(query, {'slug':1}).skip(skip).limit(1).exec((err, pub)=> {
				if (err){ return callback(err, null); }

				if(!pub[0]){ return callback(err, null); }

				return callback(null, pub[0].slug);
		});

	});
};

module.exports = mongoose.model('Pub', pubSchema);
