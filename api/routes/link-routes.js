const app = require('../api');

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const Jrnl = require('../models').Jrnl;
const Promise = require('bluebird');

export function getMedia(req, res) {
	const {filterParams} = req.query;
	const userID = req.user ? req.user._id : undefined;
	// Check permission type

	// Grab all the atom links the user is an author of
	// Populate the destination of those links
	// Grab the most recent version from all those destination Atoms
	// Query for all of the recent versions
	// Merge the parent Atoms into the most recent versions and return those versions.
	Link.find({source: userID, type: {$in: ['editor', 'reader', 'author']}}).populate({
		path: 'destination',
		model: Atom,
	}).exec()
	.then(function(linkResults) {
		const versionIDs = linkResults.filter((item)=> {
			return item.destination && item.destination.versions && item.destination.versions.length;
		}).map((item)=> {
			return item.destination.versions[item.destination.versions.length - 1];
		});
		return [linkResults, Version.find({_id: {$in: versionIDs}})];
	})
	.spread(function(linkResults, versionResults) {
		const mergedVersions = versionResults.map((item)=>{
			linkResults.map((link)=> {
				if (String(link.destination._id) === String(item.parent)) {
					item.parent = link.destination;
				}
			});
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
