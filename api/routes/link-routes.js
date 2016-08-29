const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const User = require('../models').User;
// const Promise = require('bluebird');

export function getMedia(req, res) {
	// const {filterParams} = req.query;
	const userID = req.user ? req.user._id : undefined;
	// Check permission type

	// Grab all the atom links the user is an author of
	// Populate the destination of those links
	// Grab the most recent version from all those destination Atoms
	// Query for all of the recent versions
	// Merge the parent Atoms into the most recent versions and return those versions.
	
	Link.find({source: userID, type: {$in: ['editor', 'author']}}).populate({
		path: 'destination',
		model: Atom,
	}).exec()
	.then(function(linkResults) {
		const versionIDs = linkResults.filter((item)=> {
			return item.destination && item.destination.versions && item.destination.versions.length;
		}).map((item)=> {
			return item.destination.versions[item.destination.versions.length - 1];
		});
		return [linkResults, Version.find({_id: {$in: versionIDs}}).lean()];

	})
	.spread(function(linkResults, versionResults) {
		const atomIDs = linkResults.map((link)=> {
			return link.destination._id;
		});

		const getContributors = Link.find({destination: {$in: atomIDs}, type: {$in: ['author', 'editor', 'reader', 'contributor']}, inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'username name image bio',
		}).exec();

		return [linkResults, versionResults, getContributors];

	})
	.spread(function(linkResults, versionResults, contributorsResults) {
		const atomObject = {};
		linkResults.map((link)=> {
			atomObject[link.destination._id] = link.destination;
		});

		const contributorsObject = {};
		linkResults.map((link)=> {
			contributorsObject[link.destination._id] = [];
		});
		contributorsResults.map((contributor)=> {
			contributorsObject[contributor.destination].push(contributor);
		});


		const mergedVersions = versionResults.map((item)=>{
			item.contributors = contributorsObject[item.parent];
			item.parent = atomObject[item.parent];
			item.permissionType = item.contributors.reduce((previousValue, contributor)=> {
				if (contributor.source && String(contributor.source._id) === String(userID)) {
					return contributor.type;
				}
				return previousValue;
			}, undefined);
			return item;
		});
		return res.status(201).json(mergedVersions);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});


}
app.get('/getMedia', getMedia);
