const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const Jrnl = require('../models').Jrnl;
const User = require('../models').User;
const Promise = require('bluebird');

const SHA1 = require('crypto-js/sha1');
const encHex = require('crypto-js/enc-hex');

const Firebase = require('firebase');

const Request = require('request-promise');
const request = require('superagent-promise')(require('superagent'), Promise);

import {fireBaseURL, firebaseTokenGen, generateAuthToken} from '../services/firebase';

export function createAtom(req, res) {
	if (!req.user) {
		return res.status(403).json('Not Logged In');
	}

	const userID = req.user._id;
	const now = new Date().getTime();
	const type = req.body.type || 'markdown';
	const hash = SHA1(type + new Date().getTime() + req.user._id).toString(encHex);
	const ref = new Firebase(fireBaseURL + hash + '/editorData' );

	const atom = new Atom({
		slug: hash,
		title: 'New Pub: ' + new Date().getTime(),
		type: type,

		createDate: now,
		lastUpdated: now,
		isPublished: false,

		versions: [],
		tags: [],
	});

	let versionID;
	// This should be made more intelligent to use images, video thumbnails, etc when possible - if the atom type is image, video, etc.
	atom.previewImage = 'https://assets.pubpub.org/_site/pub.png';

	atom.save() // Save new atom data
	.then(function(newAtom) { // Create new Links pointing between atom and author
		const newAtomID = newAtom._id;
		const tasks = [
			Link.createLink('editor', userID, newAtomID, userID, now),
			Link.createLink('author', userID, newAtomID, userID, now),
		];

		// If there is version data, create the version!
		if (req.body.versionContent) {
			const newVersion = new Version({
				type: newAtom.type,
				message: '',
				parent: newAtom._id,
				content: req.body.versionContent
			});
			tasks.push(newVersion.save());
		}

		return Promise.all(tasks);
	})
	.then(function(taskResults) { // If we created a version, make sure to add that version to parent
		if (taskResults.length === 3) {
			const versionData = taskResults[2];
			versionID = versionData._id;
			return Atom.update({ _id: versionData.parent }, { $addToSet: { versions: versionData._id} }).exec();
		}
		return undefined;
	})
	.then(function() {
		if (type !== 'jupyter') { return undefined; }
		return Request.post('http://jupyter-dd419b35.e87eb116.svc.dockerapp.io/convert', {form: { url: req.body.versionContent.url } });
	})
	.then(function(response) {
		if (type !== 'jupyter') { return undefined; }
		return Version.update({ _id: versionID }, { $set: { 'content.htmlUrl': response} }).exec();
		// newVersion.content.htmlUrl = response;
	})
	.then(function() { // If type is markdown, authenticate firebase connection
		if (type !== 'markdown') { return undefined; }

		return ref.authWithCustomToken(generateAuthToken());
	})
	.then(function() { // If type is markdown, add author to firebase permissions
		if (type !== 'markdown') { return undefined; }

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
			image: req.user.image,
			permission: 'edit',
			admin: true,
		};
		return ref.set(newEditorData);
	})
	.then(function() { // Return hash of new atom
		return res.status(201).json(hash);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createAtom', createAtom);

export function getAtomData(req, res) {
	const {slug, meta, version} = req.query;
	// const userID = req.user ? req.user._id : undefined;
	// Check permission type

	Atom.findOne({slug: slug}).lean().exec()
	.then(function(atomResult) { // Get most recent version
		if (!atomResult) {
			throw new Error('Atom does not exist');
		}

		const getAuthors = new Promise(function(resolve) {
			const query = Link.find({destination: atomResult._id, type: 'author'}).populate({
				path: 'source',
				model: User,
				select: 'username name firstName lastName image ',
			}).exec();
			resolve(query);
		});

		// Get the most recent version
		// This query fires if no meta and no version are specified
		const getVersion = new Promise(function(resolve) {
			if ((!meta || meta === 'export' || meta === 'cite') && !version ) {
				const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
				resolve(Version.findOne({_id: mostRecentVersionId}).exec());
			} else if ((!meta || meta === 'export' || meta === 'cite') && version) {
				resolve(Version.findOne({_id: version}).exec());
			} else {
				resolve();
			}
		});

		// Get the collaborators associated with the atom
		// This query fires if meta is equal to 'collaborators'
		const getContributors = new Promise(function(resolve) {
			if (meta === 'contributors') {
				const query = Link.find({destination: atomResult._id, type: {$in: ['author', 'editor', 'reader', 'contributor']}, inactive: {$ne: true}}).populate({
					path: 'source',
					model: User,
					select: 'username name image bio',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const getVersions = new Promise(function(resolve) {
			if (meta === 'versions') {
				const query = Version.find({_id: {$in: atomResult.versions}}, {content: 0}).sort({createDate: -1});
				resolve(query);
			} else {
				resolve();
			}
		});

		const getSubmitted = new Promise(function(resolve) {
			if (meta === 'journals') {
				const query = Link.find({source: atomResult._id, type: 'submitted'}).populate({
					path: 'destination',
					model: Jrnl,
					select: 'jrnlName slug description icon',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const getFeatured = new Promise(function(resolve) {
			if (meta === 'journals') {
				const query = Link.find({destination: atomResult._id, type: 'featured'}).populate({
					path: 'source',
					model: Jrnl,
					select: 'jrnlName slug description icon',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const tasks = [
			getAuthors,
			getVersion,
			getContributors,
			getVersions,
			getSubmitted,
			getFeatured,

		];

		return [atomResult, Promise.all(tasks)];
	})
	.spread(function(atomResult, taskData) { // Send response
		// What's spread? See here: http://stackoverflow.com/questions/18849312/what-is-the-best-way-to-pass-resolved-promise-values-down-to-a-final-then-chai
		return res.status(201).json({
			atomData: atomResult,
			authorsData: taskData[0],
			currentVersionData: taskData[1],
			contributorsData: taskData[2],
			versionsData: taskData[3],
			submittedData: taskData[4],
			featuredData: taskData[5],
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});


}
app.get('/getAtomData', getAtomData);

export function getAtomEdit(req, res) {
	console.log("Getting atom edit");
	const {slug} = req.query;
	// const userID = req.user ? req.user._id : undefined;
	// Check permission type

	let token = undefined;
	let collab = false; // collab tells you if a connection was established to the collab server

	request
	.post('localhost:8000/authenticate') //192.241.154.71
	.send({
		user: 'hassan',
		slug: slug
	})
  .set('Accept', 'application/json')
	.end(function(err, res) {
		if (err) {
			console.log('Error getting token from collab server');
		} else {
			token = res.text;
			collab = true;
		}
	}).catch(function(err){
		console.log("Caught bb")
	})
	.then(function() {
		console.log("Anyways")
		return Atom.findOne({slug: slug}).lean().exec()
	})
	.then(function(atomResult) { // Get most recent version
		const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
		return [atomResult, Version.findOne({_id: mostRecentVersionId}).exec()];
	})
	.spread(function(atomResult, versionResult) { // Send response
		const output = {
			atomData: atomResult,
			currentVersionData: versionResult,
			token: token,
			collab: collab
		};

		if (atomResult.type === 'markdown') { // If we're sending down Editor data for a markdown atom, include the firebase token so we can do collaborative editing
			output.atomData.token = firebaseTokenGen(req.user.username, slug, false); // the false should be {isReader}
		}

		return res.status(201).json(output);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getAtomEdit', getAtomEdit);

export function getAtomEditModalData(req, res) {
	const {mode, atomID} = req.query;
	// const userID = req.user ? req.user._id : undefined;
	// Check permission type

	// Get the contributors associated with the atom
	// This query fires if meta is equal to 'contributors'
	const getDetails = new Promise(function(resolve) {
		if (mode === 'details') {
			const query = Atom.findOne({_id: atomID});
			resolve(query);
		} else {
			resolve();
		}
	});

	// Get the contributors associated with the atom
	// This query fires if meta is equal to 'contributors'
	const getContributors = new Promise(function(resolve) {
		if (mode === 'contributors') {
			const query = Link.find({destination: atomID, type: {$in: ['author', 'editor', 'reader', 'contributor']}, inactive: {$ne: true}}).populate({
				path: 'source',
				model: User,
				select: 'username name image bio',
			}).exec();
			resolve(query);
		} else {
			resolve();
		}
	});

	const getVersions = new Promise(function(resolve) {
		if (mode === 'publishing') {
			const query = Version.find({parent: atomID}, {content: 0}).exec();
			resolve(query);
		} else {
			resolve();
		}
	});


	const tasks = [
		getDetails,
		getContributors,
		getVersions,
	];

	Promise.all(tasks)
	.then(function(taskResults) { // Get most recent version
		return res.status(201).json({
			detailsData: taskResults[0],
			contributorsData: taskResults[1],
			publishingData: taskResults[2],
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getAtomEditModalData', getAtomEditModalData);

export function submitAtomToJournals(req, res) {
	const atomID = req.body.atomID;
	const journalIDs = req.body.journalIDs || [];
	const userID = req.user._id;
	const now = new Date().getTime();
	// Check permission

	const tasks = journalIDs.map((id)=>{
		return Link.createLink('submitted', atomID, id, userID, now);
	});

	Promise.all(tasks)
	.then(function(newLinks) {
		return Link.find({source: atomID, type: 'submitted'}).populate({
			path: 'destination',
			model: Jrnl,
			select: 'jrnlName slug description icon',
		}).exec();

	})
	.then(function(submittedLinks) {
		return res.status(201).json(submittedLinks);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/submitAtomToJournals', submitAtomToJournals);

export function updateAtomDetails(req, res) {
	const atomID = req.body.atomID;
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }
	// Check permission

	Atom.findById(atomID).exec()
	.then(function(result) {
		// Validate and clean submitted values
		const newDetails = req.body.newDetails || {};
		result.title = newDetails.title;
		result.slug = result.isPublished ? result.slug : newDetails.slug;
		result.description = newDetails.description && newDetails.description.substring(0, 140);
		result.previewImage = newDetails.previewImage;
		result.customAuthorString = newDetails.customAuthorString;
		return result.save();
	})
	.then(function(savedResult) {
		return res.status(201).json(savedResult);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/updateAtomDetails', updateAtomDetails);

/* -------------------- */
/* Contributor Routes   */
/* -------------------- */


export function addContributor(req, res) {
	const {atomID, contributorID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	// Check permission

	Link.findOne({source: contributorID, destination: atomID, inactive: {$ne: true}}).exec()
	.then(function(existingLink) {
		if (existingLink) {
			throw new Error('Contributor already exists');
		}
		return Link.createLink('reader', contributorID, atomID, userID, now);
	})
	.then(function(newAdminLink) {
		return Link.findOne({source: contributorID, destination: atomID, type: 'reader', inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'name username image',
		}).exec();
	})
	.then(function(populatedLink) {
		return res.status(201).json(populatedLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/addContributor', addContributor);

export function updateContributor(req, res) {
	const {linkID, linkType, linkRoles} = req.body;

	Link.update({_id: linkID}, {$set: {type: linkType, 'metadata.roles': linkRoles}})
	.then(function(updateResult) {
		return res.status(201).json('success');
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/updateContributor', updateContributor);

export function deleteContributor(req, res) {
	const {linkID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	// Check permission

	Link.setLinkInactiveById(linkID, userID, now, 'deleted')
	.then(function(deletedLink) {
		return res.status(201).json(deletedLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/deleteContributor', deleteContributor);
