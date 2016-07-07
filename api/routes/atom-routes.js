const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const Promise = require('bluebird');

const SHA1 = require('crypto-js/sha1');
const encHex = require('crypto-js/enc-hex');

const Firebase = require('firebase');

const Request = require('request-promise');

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

			if (type === 'jupyter') {
				console.log(req.body.versionContent.url);
				// @To-Do: https
				Request.post('http://localhost:2001/convert', {form: { url: req.body.versionContent.url, fn: newVersion.content.url } })
				.then( function(response) {
					// response is the URL to the asset
					console.log('Respo? ' + response);
					console.log('URL' +newVersion.content.url);
					// newVersion.content.url = response;
					// console.log("New version " + newVersion.content.url);
				})
				.catch(function(err) {
					console.log('Caught an err ' + err);
				});
			}
			tasks.push(newVersion.save());
		}

		return Promise.all(tasks);
	})
	.then(function(taskResults) { // If we created a version, make sure to add that version to parent
		if (taskResults.length === 3) {
			const versionData = taskResults[2];
			return Atom.update({ _id: versionData.parent }, { $addToSet: { versions: versionData._id} }).exec();
		}
		return undefined;
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
		const output = {
			atomData: atomResult,
			currentVersionData: versionResult
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
