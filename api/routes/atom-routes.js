const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const User = require('../models').User;
const Group = require('../models').Group;
const Asset = require('../models').Asset;
const Journal = require('../models').Journal;
const Version = require('../models').Version;
// const Reference = require('../models').Reference;
const Notification = require('../models').Notification;
const Promise = require('bluebird');

const SHA1 = require('crypto-js/sha1');
const encHex = require('crypto-js/enc-hex');

const _ = require('underscore');
const Firebase = require('firebase');
const less = require('less');

import {fireBaseURL, firebaseTokenGen, generateAuthToken} from '../services/firebase';
import {sendAddedAsCollaborator} from '../services/emails';

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
	const userID = req.user ? req.user._id : undefined;
	// Check permission type
	// Load specific data
	// const populationArray = [];
	// const fieldObject = {'_id': 1, 'title': 1, 'slug': 1};

	// if (!slug) {
	// 	return res.status(404).json();
	// } else if (meta === 'contributors') {
	// 	populationArray.push({
	// 		path: 'pubsFeatured',
	// 		select: 'title abstract slug authors lastUpdated createDate discussions createDate lastUpdated',
	// 		populate: [
	// 			{
	// 				path: 'authors',
	// 				model: 'User',
	// 				select: 'name firstName lastName username thumbnail',
	// 			},
	// 		],
	// 	});
	// 	fieldObject.contributors = 1;
	// }

	const populationArray = [
		{
			path: 'discussions',
			model: 'Discussion',
			populate: {
				path: 'author',
				model: 'User',
				select: 'name firstName lastName username thumbnail',
			},
		},
		{ path: 'authors history.authors', select: 'username name thumbnail firstName lastName', model: 'User' },
	];
	const fieldObject = {};

	Atom.findOne({slug: slug}, fieldObject).populate(populationArray).exec()
	.then(function(result) {
		return res.status(201).json({
			atomData: result,
			versionData: null,
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
	const userID = req.user ? req.user._id : undefined;
	// Check permission type

	Atom.findOne({slug: slug}).exec()
	.then(function(atomResult) { // Get most recent version
		const mostRecentVersionId = atomResult.versions[atomResult.versions.length];
		return [atomResult, Version.findOne({_id: mostRecentVersionId}).exec()];
	})
	.spread(function(atomResult, versionResult) { // Send response
		return res.status(201).json({
			atomData: atomResult,
			versionData: versionResult
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getAtomEdit', getAtomEdit);
