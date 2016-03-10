var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Group = require('../models').Group;
var Asset = require('../models').Asset;
var Journal = require('../models').Journal;
var Reference = require('../models').Reference;
var Notification = require('../models').Notification;

var _         = require('underscore');
var Firebase  = require('firebase');
var less      = require('less');

import {fireBaseURL, firebaseTokenGen, generateAuthToken} from '../services/firebase';
import {sendAddedAsCollaborator} from '../services/emails';


export function getPub(req, res) {
	const userID = req.user ? req.user._id : undefined;
	const journalID = req.query.journalID;
	Pub.getPub(req.query.slug, userID, journalID, (err, pubData)=>{
		if (err) { console.log(err); return res.status(500).json(err); }

		if (req.query.referrer) {
			User.findOne({'_id':req.query.referrer}, {'_id':1,'image':1, 'thumbnail':1, 'name':1, 'username':1}).exec(function (err, referrer) {
				pubData.referrer = referrer;
				return res.status(201).json(pubData);
			});
		} else {
			return res.status(201).json(pubData);
		}

	});
}
app.get('/getPub', getPub);


app.get('/getPubEdit', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	const userGroups = req.user ? req.user.groups : [];
	Pub.getPubEdit(req.query.slug, userID, userGroups, (err, pubEditData, authError)=>{
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		if (!authError) {
			pubEditData.token = firebaseTokenGen(req.user.username, req.query.slug, pubEditData.isReader);
		}


		return res.status(201).json(pubEditData);

	});
});


app.post('/createPub', function(req, res) {
	const userID = req.user ? req.user._id : undefined;

	Pub.isUnique(req.body.slug, (err, result)=>{
		if(!result){ return res.status(500).json('URL Title is not Unique!'); }

		const pub = new Pub({
			title: req.body.title,
			slug: req.body.slug,
			abstract: 'Type your abstract here',
			collaborators: {
				canEdit:[userID],
				canRead:[]
			},
			createDate: new Date().getTime(),
			status: 'Unpublished',
			assets: [],
			history: [],
			followers: [],
			featuredIn: [],
			featuredInList: [],
			submittedTo: [],
			submittedToList: [],
			reviews: [],
			discussions: [],
			experts: {
				approved: [],
				suggested: []
			},
			settings: {
				pubPrivacy: 'public',
			}
		});
		// console.log(pub);

		pub.save(function (err, savedPub) {
			if (err) { return res.status(500).json(err);  }

			const pubID = savedPub.id;
			const userID = req.user['_id'];

			User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			const ref = new Firebase(fireBaseURL + req.body.slug + '/editorData' );
			ref.authWithCustomToken(generateAuthToken(), ()=>{
				const newEditorData = {
					collaborators: {},
					settings: {},
				};
				newEditorData.collaborators[req.user.username] = {
					_id: userID.toString(),
					name: req.user.name,
					firstName: req.user.firstName || '',
					lastName: req.user.lastName || '',
					username: req.user.username,
					email: req.user.email,
					thumbnail: req.user.thumbnail,
					permission: 'edit',
					admin: true,
				};
				newEditorData.settings.pubPrivacy = 'public';
				ref.set(newEditorData);

				return res.status(201).json(savedPub.slug);
			});

		});

	});

});

app.post('/updatePub', function(req, res) {
	// push updates to pub doc,
	// handle updates to other docs
});

app.post('/publishPub', function(req, res) {

	// Check that the req.user is an editor on the pub.
	// Beef out the history object with date, etc
	// Update the pub object with new dates, titles, etc
	// Push the new history object
	Pub.findOne({ slug: req.body.newVersion.slug }, function (err, pub){
		if (err) { return res.status(500).json(err);  }

		// if (!req.user || pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.toString().split(',');
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}
		const publishDate = new Date().getTime();
		// Calculate diff
		// Take last history object,
		// take new object,
		// diff them and return object
			// diff each item in object and store output
			// iterate over to calculate total additions, deletions
		const previousHistoryItem = pub.history.length
			? pub.history[pub.history.length-1]
			: {
				title: '',
				abstract: '',
				authorsNote: '',
				markdown: '',
				// authors: {}, // We need to save an author's string and then diff that...
				// assets: [],
				// references: [],
				// style: {},
			}
		const diffObject = Pub.generateDiffObject(previousHistoryItem, req.body.newVersion);
		// Append details to assets
		const assets = [];
		for (const key in req.body.newVersion.assets) {
			const assetObject = req.body.newVersion.assets[key];
			assetObject.usedInDiscussion = null;
			assetObject.usedInPub = pub._id;
			assetObject.owner = req.user._id;
			assetObject.createDate = publishDate;
			assets.push(assetObject);
		}

		// Append details to references
		const references = [];
		for (const key in req.body.newVersion.references) {
			const referenceObject = req.body.newVersion.references[key];
			referenceObject.usedInDiscussion = null;
			referenceObject.usedInPub = pub._id;
			referenceObject.owner = req.user._id;
			referenceObject.createDate = publishDate;
			references.push(referenceObject);
		}

		const isNewPub = pub.history.length === 0;
		req.body.newVersion.authors.map((authorID)=>{
			User.findOne({_id: authorID}, {'followers':1}).lean().exec(function (err, author) {
				const followers = author && author.follows ? author.follows : [];
				
				followers.map((follower)=>{
					if (isNewPub) {
						Notification.createNotification('followers/newPub', req.body.host, author, follower, pub._id);
					} else {
						Notification.createNotification('followers/newVersion', req.body.host, author, follower, pub._id);
					}
				});	
				
			});
		});

		Asset.insertBulkAndReturnIDs(assets, function(err, dbAssetsIds){
			if (err) { return res.status(500).json(err);  }
			Reference.insertBulkAndReturnIDs(references, function(err, dbReferencesIds){
				if (err) { return res.status(500).json(err);  }
				pub.title = req.body.newVersion.title;
				pub.abstract = req.body.newVersion.abstract;
				pub.authorsNote = req.body.newVersion.authorsNote;
				pub.markdown = req.body.newVersion.markdown;
				pub.authors = req.body.newVersion.authors;
				pub.assets = dbAssetsIds;
				pub.references = dbReferencesIds;
				pub.style = req.body.newVersion.style;
				pub.styleRawDesktop = req.body.newVersion.styleRawDesktop;
				pub.styleRawMobile = req.body.newVersion.styleRawMobile;
				pub.styleScoped = req.body.newVersion.styleScoped;
				pub.lastUpdated = publishDate,
				pub.status = req.body.newVersion.status;
				pub.history.push({
					publishNote: req.body.newVersion.publishNote,
					publishDate: publishDate,
					publishAuthor: req.user._id,
					title: req.body.newVersion.title,
					abstract: req.body.newVersion.abstract,
					authorsNote: req.body.newVersion.authorsNote,
					markdown: req.body.newVersion.markdown,
					authors: req.body.newVersion.authors,
					assets: dbAssetsIds,
					references: dbReferencesIds,
					style: req.body.newVersion.style,

					styleRawDesktop: req.body.newVersion.styleRawDesktop,
					styleRawMobile: req.body.newVersion.styleRawMobile,
					styleScoped: req.body.newVersion.styleScoped,

					status: req.body.newVersion.status,
					diffObject: {
						additions:  diffObject.additions,
						deletions:  diffObject.deletions,
						diffTitle:  diffObject.diffTitle,
						diffAbstract:  diffObject.diffAbstract,
						diffAuthorsNote: diffObject.diffAuthorsNote,
						diffMarkdown: diffObject.diffMarkdown,
						// diffAuthors:  diffObject.diffAuthors,
						// diffAssets:  diffObject.diffAssets,
						// diffReferences: diffObject.diffReferences,
						// diffStyle:  diffObject.diffStyle,
					}
				});

				pub.save(function(err, result){
					if (err) { return res.status(500).json(err);  }
					// console.log('in save result');
					// console.log(result);
					return res.status(201).json('Published new version');

				});



			});

		});

	});
});

app.post('/updateCollaborators', function(req, res) {
	Pub.findOne({ slug: req.body.slug }, function (err, pub){
		if (err) { return res.status(500).json(err);  }

		// Check to make sure the user is authorized to be submitting such changes.
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.toString().split(',');
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		const pubID = pub._id;
		const canEdit = [];
		const canRead = [];
		// Iterate through each user in the collaborators object, add them to appropriate array.
		_.forEach(req.body.newCollaborators, function(collaborator){
			if (collaborator.permission === 'edit') {
				canEdit.push(collaborator._id);
				// Update the user's pubs collection so it is bound to their profile
				User.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
				Group.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			} else {
				canRead.push(collaborator._id);
				// Update the user's pubs collection so it is removed from their profile
				// User.update({ _id: collaborator._id }, { $pull: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
				
				// Psych! We actually want it on the user's profile - just under the 'canRead' section
				User.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
				Group.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			}
		});
		const collaborators = {
			canEdit: canEdit,
			canRead: canRead
		};

		/* *********************************** */
		/* Send new user(s) email notification */
		/* *********************************** */
		const allUsersOld = pub.collaborators.canEdit.concat(pub.collaborators.canRead).toString().split(',');
		const allUsersNew = collaborators.canEdit.concat(collaborators.canRead);
		const newID = _.difference(allUsersNew, allUsersOld);

		User.findOne({_id: newID}).lean().exec(function(err, user){
			Group.findOne({_id: newID}).populate({path: "members", select:'email'}).lean().exec(function(err, group){
				Journal.findOne({ $or:[ {'subdomain':req.query.host.split('.')[0]}, {'customDomain':req.query.host}]}).exec(function(err, journal){
					let url = '';
					if (journal) {
						url = journal.customDomain ? 'http://' + journal.customDomain + '/pub/' + pub.slug + '/draft' : 'http://' + journal.subdomain + '.pubpub.org/pub/' + pub.slug + '/draft';
					} else {
						url = 'http://www.pubpub.org/pub/' + pub.slug + '/draft';
					}
					const groupName = group ? group.groupName : undefined;
					const journalName = journal ? journal.journalName : undefined;
					const senderName = req.user.name;
					const pubTitle = pub.title;

					if (user) {
						const email = user.email;
						sendAddedAsCollaborator(email, url, senderName, pubTitle, groupName, journalName, function(err, result){
							if (err) { console.log('Error sending email to user: ', error);	}
						});
					} 

					if (group) {
						for (let index = group.members.length; index--;) {
							const email = group.members[index].email;
							sendAddedAsCollaborator(email, url, senderName, pubTitle, groupName, journalName, function(err, result){
								if (err) { console.log('Error sending email to user: ', error);	}
							});
						}
					}
				});
			});
		});
		/* *********************************** */
		/*        End notification block       */
		/* *********************************** */


		if (req.body.removedUser) {
			User.update({ _id: req.body.removedUser }, { $pull: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			Group.update({ _id: req.body.removedUser }, { $pull: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
		}
		// console.log(collaborators);
		Pub.update({slug: req.body.slug}, { $set: { collaborators: collaborators }}, function(result){
			// console.log(result);
			res.status(201).json('Collaborator Data Saved');
		})
	});
	// For each of the canEdits, need to update their Pubs access stuff

});


app.post('/updatePubSettings', function(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	Pub.findOne({slug: req.body.slug}, function(err, pub){

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		// if (!req.user || pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.toString().split(',');
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		pub.settings[settingKey] = req.body.newSettings[settingKey];

		pub.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(pub.settings);
		});

	});
});

app.post('/updatePubData', function(req, res) {
	Pub.findOne({slug: req.body.slug}, function(err, pub){

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		if (!pub) { return res.status(403).json('Not authorized to edit this pub'); }

		// if (!req.user || pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.toString().split(',');
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to edit this pub');
		}

		for (const key in req.body.newPubData) {
			pub[key] = req.body.newPubData[key];
		}
		// pub.settings[settingKey] = req.body.newSettings[settingKey];

		pub.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(req.body.newPubData);
		});

	});
});

app.post('/transformStyle', function(req, res) {
	const importsDesktop = req.body.styleDesktop.match(/(@import.*)/g) || [];
	const importsMobile = req.body.styleMobile.match(/(@import.*)/g) || [];
	const styleDesktopClean = req.body.styleDesktop.replace(/(@import.*)/g, '');
	const styleMobileClean = req.body.styleMobile.replace(/(@import.*)/g, '');
	
	const fullString = importsDesktop.join(' ') + ' ' + importsMobile.join(' ') + ' #pubContent{' + styleDesktopClean +'} @media screen and (min-resolution: 3dppx), screen and (max-width: 767px){ #pubContent{' + styleMobileClean + '}}';
	less.render(fullString, function (err, output) {
		if (err) {
			return res.status(500).json('Invalid CSS');
		}
		// console.log(output.css);
		return res.status(201).json(output.css);
	});
});
