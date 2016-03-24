const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Notification = require('../models').Notification;
const _ = require('underscore');
import * as jsdiff from 'diff';

const pubSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },
	title: { type: String },
	abstract: { type: String },
	createDate: { type: Date },
	lastUpdated: { type: Date },

	// --------------
	// The Items in this block are fozen at publish time.
	// All changes that are made pre-update-publish are stored and synced to firebase.
	// Their change has no reflection in the variables stored here.
	// This is to ensure that non-published updates don't leak into the Reader
	markdown: { type: String },
	authors: [{ type: ObjectId, ref: 'User'}],
	styleDesktop: { type: String }, // Raw string as user input
	styleMobile: { type: String }, // Raw string as user input
	styleScoped: { type: String }, // CSS scoped to proper div

	isPublished: { type: Boolean },
	// --------------

	history: [{ // History is appended to each time a 'publish' is made.
		versionNote: { type: String },
		versionDate: { type: Date },
		versionAuthor: { type: ObjectId, ref: 'User'},

		diffObject: {
			additions: { type: Number },
			deletions: { type: Number },
			diffMarkdown: [],
			diffStyleDesktop: [],
			diffStyleMobile: [],
		},

		markdown: { type: String },
		authors: [{ type: ObjectId, ref: 'User'}],
		styleDesktop: { type: String },
		styleMobile: { type: String },
		styleScoped: { type: String },

		isPublished: { type: Boolean },
	}],

	// A duplicate cache of the parameters as defined in the editor.
	// Also stored here so that we can privelege access to the editor
	// and to private pubs
	collaborators: {
		canEdit: [{ type: ObjectId, ref: 'User'}],
		canRead: [{ type: ObjectId, ref: 'User'}]
	},

	followers: [{ type: ObjectId, ref: 'User'}],

	// An object to track all the the journals this pub is featured in
	featuredIn: [{
		journal: { type: ObjectId, ref: 'Journal' },
		date: { type: Date },
		by: { type: ObjectId, ref: 'User' },
		note: { type: String },
	}],
	featuredInList: [{type: ObjectId, ref: 'Journal' }], // A aggregate of the journal value in the featuredIn field - used for querying simplicity

	// An object to track all the the journals this pub is submitted to
	submittedTo: [{
		journal: { type: ObjectId, ref: 'Journal' },
		date: { type: Date },
		by: { type: ObjectId, ref: 'User' },
		note: { type: String },
	}],
	submittedToList: [{type: ObjectId, ref: 'Journal' }], // A aggregate of the journal value in the submittedTo field - used for querying simplicity
});


pubSchema.statics.isUnique = function (slug, callback) {

	this.findOne({'slug': slug})
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


pubSchema.statics.getPub = function(slug, readerID, readerGroups, journalID, callback) {
	this.findOne({slug: slug})
	// .populate({ path: 'discussions', model: 'Discussion' })
	// .populate({ path: 'assets history.assets', model: 'Asset' })
	// .populate({ path: 'references history.references', model: 'Reference' })
	.populate({ path: 'featuredIn.journal submittedTo.journal', select: 'journalName subdomain customDomain design', model: 'Journal' })
	.populate({ path: 'authors history.authors', select: 'username name thumbnail firstName lastName', model: 'User' })
	.exec((err, populatedPub)=> {
		// const options = [
		// 	{ path: 'discussions.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
		// 	// { path: 'discussions.selections', model: 'Highlight'}
		// ];

		// this.populate(pub, options, (err, populatedPub)=> {
		if (err) { return callback(err, null); }

		if (!populatedPub) { return callback(null, {message: 'Pub Not Found', slug: slug}); }

		if (!populatedPub.isPublished && !readerID) { return callback(null, {message: 'Pub not yet published', slug: slug}); }

		// Check if the pub is not allowed in the journal
		if (journalID && String(populatedPub.featuredInList).indexOf(journalID) === -1 && String(populatedPub.submittedToList).indexOf(journalID) === -1) {
			return callback(null, {message: 'Pub not in this journal', slug: slug});
		}

		const readerGroupsStrings = readerGroups.length ? readerGroups.toString().split(',') : [];
		const canReadStrings = populatedPub.collaborators.canRead.length ? populatedPub.collaborators.canRead.toString().split(',') : [];
		const canEditStrings = populatedPub.collaborators.canEdit.length ? populatedPub.collaborators.canEdit.toString().split(',') : [];
		if (!populatedPub.isPublished &&
			readerID.toString() !== '568abdd9332c142a0095117f' &&
			canEditStrings.indexOf(readerID.toString()) === -1 &&
			canReadStrings.indexOf(readerID.toString()) === -1 &&
			_.intersection(readerGroupsStrings, canEditStrings).length === 0 &&
			_.intersection(readerGroupsStrings, canReadStrings).length === 0) {
			return callback(null, {message: 'Pub not yet published', slug: slug});
		}

		// Check if the pub is private, and if so, check readers/authors list
		// if (populatedPub.settings.pubPrivacy === 'private') {
		// 	if (populatedPub.collaborators.canEdit.indexOf(readerID) === -1 && populatedPub.collaborators.canRead.indexOf(readerID) === -1) {
		// 		return callback(null, {message: 'Private Pub', slug: slug});
		// 	}
		// }

		// Mark all notifcations about this pub for this reader as 'sent' (i.e. don't send an email, but keep it unread until they go to notifications page)
		Notification.setSent({pub: populatedPub._id, recipient: readerID}, ()=>{});

		const outputPub = populatedPub.toObject();
		if (populatedPub.collaborators.canEdit.indexOf(readerID) > -1) {
			outputPub.isAuthor = true;
		}

		// outputPub.discussions = Discussion.appendUserYayNayFlag(outputPub.discussions, readerID);
		// outputPub.discussions = Discussion.calculateYayNayScore(outputPub.discussions);
		// outputPub.discussions = Discussion.sortDiscussions(outputPub.discussions);
		// outputPub.discussions = Discussion.nestChildren(outputPub.discussions);
		// console.log(outputPub.isAuthor);
		return callback(null, outputPub);
		// });

	});
};

pubSchema.statics.getPubEdit = function(slug, readerID, readerGroups, callback) {
	// Get the pub and check to make sure user is authorized to edit
	this.findOne({slug: slug})
	// .populate({ path: 'discussions', model: 'Discussion' })
	// .populate({ path: 'editorComments', model: 'Discussion' })
	.exec((err, pub) =>{
		if (err) { return callback(err, null); }

		if (!pub) { return callback(null, 'Pub Not Found', true); }

		if (!readerID) { return callback(null, 'Not Authorized', true); }

		const readerGroupsStrings = readerGroups.length ? readerGroups.toString().split(',') : [];
		const canReadStrings = pub.collaborators.canRead.length ? pub.collaborators.canRead.toString().split(',') : [];
		const canEditStrings = pub.collaborators.canEdit.length ? pub.collaborators.canEdit.toString().split(',') : [];

		if (readerID.toString() !== '568abdd9332c142a0095117f' &&
			canEditStrings.indexOf(readerID.toString()) === -1 &&
			canReadStrings.indexOf(readerID.toString()) === -1 &&
			_.intersection(readerGroupsStrings, canEditStrings).length === 0 &&
			_.intersection(readerGroupsStrings, canReadStrings).length === 0) {
			return callback(null, 'Not Authorized', true);
		}

		let isReader = true;
		if (canEditStrings.indexOf(readerID.toString()) > -1 || _.intersection(readerGroupsStrings, canEditStrings).length || readerID.toString() === '568abdd9332c142a0095117f') {
			isReader = false;
		}

		// Once authorized, it doesn't seem like we need to provide any data to the editor
		// That will likely change when we implement better authentication for the firepad
		// This will change when we have to pass down status to the editor. Once you publish peer-review-ready
		// You can go and publish draft...

		// We gotta pass down discussions if we want to show in editor
		// const options = [
			// { path: 'discussions.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
			// { path: 'discussions.selections', model: 'Highlight'},
			// { path: 'editorComments.author', select: '_id username name firstName lastName thumbnail', model: 'User'},
			// { path: 'editorComments.selections', model: 'Highlight'},
		// ];

		// this.populate(pub, options, (err, populatedPub)=> {
		if (err) { return callback(err, null); }
		const outputPub = pub.toObject();
		outputPub.isReader = isReader;

			// outputPub.discussions = Discussion.appendUserYayNayFlag(outputPub.discussions, readerID);
			// outputPub.discussions = Discussion.calculateYayNayScore(outputPub.discussions);
			// outputPub.discussions = Discussion.sortDiscussions(outputPub.discussions);
			// outputPub.discussions = Discussion.nestChildren(outputPub.discussions);

			// outputPub.editorComments = Discussion.appendUserYayNayFlag(outputPub.editorComments, readerID);
			// outputPub.editorComments = Discussion.calculateYayNayScore(outputPub.editorComments);
			// outputPub.editorComments = Discussion.sortDiscussions(outputPub.editorComments);
			// outputPub.editorComments = Discussion.nestChildren(outputPub.editorComments);

		return callback(null, outputPub);
		// });

		// return callback(null, {});

	});

};

pubSchema.statics.generateDiffObject = function(oldPubObject, newPubObject) {
	// Diff each item in object and store output
	// Iterate over to calculate total additions, deletions

	const outputObject = {};
	outputObject.diffMarkdown = jsdiff.diffWords(oldPubObject.markdown || '', newPubObject.markdown || '', {newlineIsToken: true});
	outputObject.diffStyleDesktop = jsdiff.diffWords(oldPubObject.styleDesktop || '', newPubObject.styleDesktop || '', {newlineIsToken: true});
	outputObject.diffStyleMobile = jsdiff.diffWords(oldPubObject.styleMobile || '', newPubObject.styleMobile || '', {newlineIsToken: true});

	let additions = 0;
	let deletions = 0;
	for (const key in outputObject) {
		if (outputObject.hasOwnProperty(key)) {
			outputObject[key].map((diffArrayItem)=>{
				if (diffArrayItem.added) {
					additions += 1;
				}
				if (diffArrayItem.removed) {
					deletions += 1;
				}
			});
		}
	}

	outputObject.additions = additions;
	outputObject.deletions = deletions;
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
	var query = {history: {$not: {$size: 0}}, 'isPublished': true};
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
