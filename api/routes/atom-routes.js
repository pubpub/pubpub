const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const Promise = require('bluebird');

const SHA1 = require('crypto-js/sha1');
const encHex = require('crypto-js/enc-hex');

const Firebase = require('firebase');

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

	atom.save() // Save new atom data
	.then(function(newAtom) { // Create new Links pointing between atom and author
		const newAtomID = newAtom._id;
		const linksToCreate = [
			Link.createLink('editor', userID, newAtomID, userID, now),
			Link.createLink('author', userID, newAtomID, userID, now),
		];
		return Promise.all(linksToCreate);
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
	// Load specific data


	Atom.findOne({slug: slug}).lean().exec()
	.then(function(atomResult) { // Get most recent version	

		// Get the most recent version
		// This query fires if no meta and no version are specified
		const getRecentVersion = new Promise(function(resolve) {
			if (!meta && !version) {
				const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
				resolve(Version.findOne({_id: mostRecentVersionId}).exec());
			} else {
				resolve();
			}
		});

		// Get the collaborators associated with the atom
		// This query fires if meta is equal to 'collaborators'
		const getContributors = new Promise(function(resolve) {
			if (meta === 'contributors') {
				// const query = Link.find({destination: atomResult._id, type: {$in: ['isAuthor', 'isEditor', 'isReader']}}).exec();
				const query = Link.find({destination: atomResult._id}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const getVersions = new Promise(function(resolve) {
			if (meta === 'versions') {
				const query = Version.find({_id: {$in: atomResult.versions}}).sort({createDate: -1});
				resolve(query);
			} else {
				resolve();
			}
		});

		const tasks = [
			getRecentVersion,
			getContributors,
			getVersions
		];

		return [atomResult, Promise.all(tasks)];
	})
	.spread(function(atomResult, taskData) { // Send response
		// What's spread? See here: http://stackoverflow.com/questions/18849312/what-is-the-best-way-to-pass-resolved-promise-values-down-to-a-final-then-chai
		return res.status(201).json({
			atomData: atomResult,
			currentVersionData: taskData[0],
			contributorData: taskData[1],
			versionsData: taskData[2]
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});


}
app.get('/getAtomData', getAtomData);

export function getAtomEdit(req, res) {
	const {slug} = req.query;
	// const userID = req.user ? req.user._id : undefined;
	// Check permission type

	Atom.findOne({slug: slug}).lean().exec()
	.then(function(atomResult) { // Get most recent version
		const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
		return [atomResult, Version.findOne({_id: mostRecentVersionId}).exec()];
	})
	.spread(function(atomResult, versionResult) { // Send response
		return res.status(201).json({
			atomData: {
				...atomResult,
				token: firebaseTokenGen(req.user.username, slug, false) // the false should be {isReader}
			},
			currentVersionData: versionResult
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getAtomEdit', getAtomEdit);
