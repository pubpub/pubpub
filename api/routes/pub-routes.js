const app = require('../api');

const Pub = require('../models').Pub;
const User = require('../models').User;
const Group = require('../models').Group;
const Asset = require('../models').Asset;
const Journal = require('../models').Journal;
// const Reference = require('../models').Reference;
const Notification = require('../models').Notification;

const _ = require('underscore');
const Firebase = require('firebase');
const less = require('less');

import {fireBaseURL, firebaseTokenGen, generateAuthToken} from '../services/firebase';
import {sendAddedAsCollaborator} from '../services/emails';
// import {featurePub, getRecommendations, inpRecAction, removeAction} from '../services/recommendations';
import {getRecommendations, inpRecAction} from '../services/recommendations';
import {checkCaptcha, checkSpam} from '../services/spam';


export function getPub(req, res) {
	const userID = req.user ? req.user._id : undefined;
	const userGroups = req.user ? req.user.groups : [];
	const userAdminJournals = req.user ? req.user.adminJournals : [];
	const journalID = req.query.journalID;
	Pub.getPub(req.query.slug, userID, userGroups, userAdminJournals, journalID, (err, pubData)=>{
		if (err) { console.log(err); return res.status(500).json(err); }

		const sessionID = (req.sessionID) ? req.sessionID : undefined;
		if (userID || sessionID) {
			// const postedID = userID || sessionID;
			const postedJournalID = journalID || 'pubpub';
			const pubID = pubData._id;

			inpRecAction(postedJournalID, pubID, userID, ['read'], function(recError, recResponse) {
				 if (recResponse && recResponse.error) {
					console.log(recResponse.error);
				 }
			 });
		}

		if (req.query.referrer) {
			User.findOne({'_id': req.query.referrer}, {'_id': 1, 'image': 1, 'thumbnail': 1, 'name': 1, 'username': 1}).exec(function(error, referrer) {
				pubData.referrer = referrer;
				return res.status(201).json(pubData);
			});
		} else {
			return res.status(201).json(pubData);
		}

	});
}
app.get('/getPub', getPub);

export function getPubEdit(req, res) {
	const userID = req.user ? req.user._id : undefined;
	const userGroups = req.user ? req.user.groups : [];
	const userAdminJournals = req.user ? req.user.adminJournals : [];
	Pub.getPubEdit(req.query.slug, userID, userGroups, userAdminJournals, (err, pubEditData, authError)=>{
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		if (!authError) {
			pubEditData.token = firebaseTokenGen(req.user.username, req.query.slug, pubEditData.isReader);
		}


		return res.status(201).json(pubEditData);

	});
}
app.get('/getPubEdit', getPubEdit);

export function createPub(req, res) {
	const userID = req.user ? req.user._id : undefined;

	if (!req.user) {
		return res.status(500).json('User does not exist!');
	}

	const token = req.body.reCaptchaToken;
	const remoteip = req.connection.remoteAddress;

	const verifyAndCreatePub = () => {
		Pub.isUnique(req.body.slug, (err, result)=>{
			if (!result) { return res.status(500).json('URL Title is not Unique!'); }
			if (req.body.slug.substring(req.body.slug.length - 12, req.body.slug.length) === '-landingpage') { return res.status(500).json('URL Title is not Unique!'); }

			Pub.createPub(req.body.slug, req.body.title, userID, false, function(createErr, savedPub) {
				if (createErr || !savedPub) { return res.status(500).json('Error Creating Pub'); }
				const pubID = savedPub.id;

				User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(errUpdate, resultUpdate) {if (errUpdate) return console.log(errUpdate);});

				const ref = new Firebase(fireBaseURL + req.body.slug + '/editorData' );
				ref.authWithCustomToken(generateAuthToken(), ()=>{
					const newEditorData = {
						collaborators: {},
						settings: {styleDesktop: ''},
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
					ref.set(newEditorData);

					return res.status(201).json(savedPub.slug);
				});
			});
		});
	};

	checkCaptcha({token, remoteip})
	.then(function() {
		verifyAndCreatePub();
	})
	.catch(function() {
		console.log('Failed Captcha', userID);
		res.status(500).json('Could not validate Captcha!');
	});

}

app.get('/getPubRecommendation', function(req, res) {

	const userID = req.user ? req.user._id : undefined;
	const sessionID = (req.sessionID) ? req.sessionID : undefined;

	const journalID = (req.query.journalID) ? req.query.journalID : 'pubpub';

	const queryID = userID || sessionID;

	getRecommendations('user', queryID, journalID, function(err, recResponse) {
		// console.log(recResponse.body);
		// console.log(recResponse.body.recommendations[0]);

		const recExists = (recResponse && recResponse.body && recResponse.body.recommendations && recResponse.body.recommendations[0]);
		const suggestedPubID = (recExists) ? recResponse.body.recommendations[0] : null;

		Pub.getSimplePub(suggestedPubID, (errGetSimple, suggestedPubData)=> {
			if (errGetSimple) {
				console.log(errGetSimple);
				return res.status(500).json(errGetSimple);
			}
			return res.status(201).json(suggestedPubData);
		});
	});
});

app.post('/createPub', createPub);


// Publish Pub turns to just toggling 'isPublished'
// the current publish funciton is what we do on save version
export function saveVersionPub(req, res) {
	// Find pub
	// Authenticate user
	// Calculate diff
	// Updates assets usedIn field
	// Update doc and save
	// Send notifications
	Pub.findOne({ slug: req.body.newVersion.slug }, function(err, pub) {
		if (err) { return res.status(500).json(err); }
		if (!pub) {
			return res.status(500).json('Pub does not exist!');
		}

		// Check to make sure the user is authorized to be submitting such changes.
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.length ? userGroups.toString().split(',') : [];
		const userAdminJournals = req.user ? req.user.adminJournals : [];
		const userAdminJournalsStrings = userAdminJournals.length ? userAdminJournals.toString().split(',') : [];
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && _.intersection(userAdminJournalsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		if (req.body.newVersion && req.body.newVersion.markdown) {
			const foundSpam = checkSpam(req.body.newVersion.markdown);
			if (foundSpam) {
				console.log('PUB_SPAM_FILTER', req.user.id);
				return res.status(403).json('');
			}
		}

		const previousHistoryItem = pub.history.length ? pub.history[pub.history.length - 1] : {markdown: '', styleDesktop: '', styleMobile: ''};
		const diffObject = Pub.generateDiffObject(previousHistoryItem, req.body.newVersion);

		// Update Asset docs to reflect that they were used in this pub
		const assetIDStrings = req.body.newVersion.markdown.match(/"_id":"(.*?)"/g) || [];
		const assetIDs = assetIDStrings.map((string)=>{
			return string.substring(7, string.length - 1);
		});

		Asset.update({'_id': {$in: assetIDs}}, { $addToSet: { usedInPubs: {id: pub._id, version: pub.history.length || 1}} }, function(assetUpdateErr, result) {if (assetUpdateErr) return console.log('Failed to update assets usedInPubs field'); });

		const versionDate = new Date().getTime();
		pub.title = req.body.newVersion.title;
		pub.abstract = req.body.newVersion.abstract;

		pub.markdown = req.body.newVersion.markdown;
		pub.authors = req.body.newVersion.authors;
		pub.styleDesktop = req.body.newVersion.styleDesktop;
		pub.styleMobile = req.body.newVersion.styleMobile;
		pub.styleScoped = req.body.newVersion.styleScoped;
		pub.isPublished = pub.isPublished || req.body.newVersion.isPublished;

		pub.lastUpdated = versionDate;

		pub.history.push({
			versionNote: req.body.newVersion.versionNote,
			versionDate: versionDate,
			versionAuthor: req.user._id,

			diffObject: {
				additions: diffObject.additions,
				deletions: diffObject.deletions,
				diffMarkdown: diffObject.diffMarkdown,
				diffStyleDesktop: diffObject.diffStyleDesktop,
				diffStyleMobile: diffObject.diffStyleMobile,
			},

			markdown: req.body.newVersion.markdown,
			authors: req.body.newVersion.authors,
			styleDesktop: req.body.newVersion.styleDesktop,
			styleMobile: req.body.newVersion.styleMobile,
			styleScoped: req.body.newVersion.styleScoped,

			isPublished: pub.isPublished || req.body.newVersion.isPublished,

		});

		pub.save(function(errPubSave, result) {
			if (errPubSave) { return res.status(500).json(err); }

			// Create notification objects about new pub
			const isNewPub = pub.history.length === 0;
			req.body.newVersion.authors.map((authorID)=>{
				User.findOne({_id: authorID}, {'followers': 1}).lean().exec(function(userFindErr, author) {
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

			return res.status(201).json('Published new version');

		});

	});
}
app.post('/saveVersionPub', saveVersionPub);

export function updateCollaborators(req, res) {
	Pub.findOne({ slug: req.body.slug }, function(err, pub) {
		if (err) { return res.status(500).json(err); }
		if (!pub) {
			return res.status(500).json('Pub does not exist!');
		}

		// Check to make sure the user is authorized to be submitting such changes.
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.length ? userGroups.toString().split(',') : [];
		const userAdminJournals = req.user ? req.user.adminJournals : [];
		const userAdminJournalsStrings = userAdminJournals.length ? userAdminJournals.toString().split(',') : [];
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && _.intersection(userAdminJournalsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		const pubID = pub._id;
		const canEdit = [];
		const canRead = [];
		// Iterate through each user in the collaborators object, add them to appropriate array.
		_.forEach(req.body.newCollaborators, function(collaborator) {
			if (collaborator.permission === 'edit') {
				canEdit.push(collaborator._id);
				// Update the user's pubs collection so it is bound to their profile
				User.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
				Group.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
			} else {
				canRead.push(collaborator._id);
				// Update the user's pubs collection so it is removed from their profile
				// User.update({ _id: collaborator._id }, { $pull: { pubs: pubID} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});

				// Psych! We actually want it on the user's profile - just under the 'canRead' section
				User.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
				Group.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
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

		User.findOne({_id: newID}).lean().exec(function(errUserFind, user) {
			Group.findOne({_id: newID}).populate({path: 'members', select: 'email'}).lean().exec(function(errGroupFind, group) {
				Journal.findOne({ $or: [ {'subdomain': req.query.host.split('.')[0]}, {'customDomain': req.query.host}]}).exec(function(errJournalFind, journal) {
					let url = '';
					if (journal) {
						url = journal.customDomain ? 'http://' + journal.customDomain + '/pub/' + pub.slug + '/draft' : 'http://' + journal.subdomain + '.pubpub.org/pub/' + pub.slug + '/draft';
					} else {
						url = 'http://www.pubpub.org/pub/' + pub.slug + '/draft';
					}
					const groupName = group ? group.groupName : undefined;
					const journalName = journal ? journal.journalName : undefined;
					const senderName = req.user.name;
					const senderEmail = req.user.email;
					const pubTitle = pub.title;

					if (user) {
						const email = user.email;
						sendAddedAsCollaborator(email, url, senderName, senderEmail, pubTitle, groupName, journalName, function(errSendAdded, result) {
							if (errSendAdded) { console.log('Error sending email to user: ', errSendAdded);	}
						});
					}

					if (group) {
						for (let index = group.members.length; index--;) {
							const email = group.members[index].email;
							sendAddedAsCollaborator(email, url, senderName, senderEmail, pubTitle, groupName, journalName, function(errSendAdded, result) {
								if (errSendAdded) { console.log('Error sending email to user: ', errSendAdded);	}
							});
						}
					}
				});
			});
		});
		/* *********************************** */
		/*				End notification block			 */
		/* *********************************** */


		if (req.body.removedUser) {
			User.update({ _id: req.body.removedUser }, { $pull: { pubs: pubID} }, function(errUpdate, result) { if (errUpdate) return console.log(errUpdate); });
			Group.update({ _id: req.body.removedUser }, { $pull: { pubs: pubID} }, function(errUpdate, result) { if (errUpdate) return console.log(errUpdate); });
		}
		// console.log(collaborators);
		Pub.update({slug: req.body.slug}, { $set: { collaborators: collaborators }}, function(result) {
			// console.log(result);
			res.status(201).json('Collaborator Data Saved');
		});
	});
	// For each of the canEdits, need to update their Pubs access stuff

}
app.post('/updateCollaborators', updateCollaborators);

export function updatePubData(req, res) {
	Pub.findOne({slug: req.body.slug}, function(err, pub) {

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		if (!pub) { return res.status(403).json('Not authorized to edit this pub'); }

		// Check to make sure the user is authorized to be submitting such changes.
		const userGroups = req.user ? req.user.groups : [];
		const userGroupsStrings = userGroups.length ? userGroups.toString().split(',') : [];
		const userAdminJournals = req.user ? req.user.adminJournals : [];
		const userAdminJournalsStrings = userAdminJournals.length ? userAdminJournals.toString().split(',') : [];
		const canEditStrings = pub.collaborators.canEdit.toString().split(',');

		if (!req.user || (pub.collaborators.canEdit.indexOf(req.user._id) === -1 && _.intersection(userGroupsStrings, canEditStrings).length === 0 && _.intersection(userAdminJournalsStrings, canEditStrings).length === 0 && req.user._id.toString() !== '568abdd9332c142a0095117f') ) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		for (const key in req.body.newPubData) {
			if (req.body.newPubData.hasOwnProperty(key)) {
				pub[key] = req.body.newPubData[key];
			}
		}
		// pub.settings[settingKey] = req.body.newSettings[settingKey];

		pub.save(function(errPubSave, result) {
			if (errPubSave) { return res.status(500).json(errPubSave); }

			return res.status(201).json(req.body.newPubData);
		});

	});
}
app.post('/updatePubData', updatePubData);

export function transformStyle(req, res) {
	const importsDesktop = req.body.styleDesktop.match(/(@import.*)/g) || [];
	const importsMobile = req.body.styleMobile.match(/(@import.*)/g) || [];
	const styleDesktopClean = req.body.styleDesktop.replace(/(@import.*)/g, '');
	const styleMobileClean = req.body.styleMobile.replace(/(@import.*)/g, '');

	const wrapperID = req.body.isPage ? '#pageContent' : '#pubContent';
	const fullString = importsDesktop.join(' ') + ' ' + importsMobile.join(' ') + ' ' + wrapperID + '{' + styleDesktopClean + '} @media screen and (min-resolution: 3dppx), screen and (max-width: 767px){ ' + wrapperID + '{' + styleMobileClean + '}}';
	less.render(fullString, function(err, output) {
		if (err) {
			return res.status(500).json('Invalid CSS');
		}
		// console.log(output.css);
		return res.status(201).json(output.css);
	});
}
app.post('/transformStyle', transformStyle);
