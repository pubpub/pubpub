const app = require('../api');

const Atom = require('../models').Atom;
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
		console.log(result);
		return res.status(201).json(result);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getAtomData', getAtomData);