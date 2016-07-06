const app = require('../api');

const Atom = require('../models').Atom;
const Version = require('../models').Version;

const Promise = require('bluebird');

const SHA1 = require('crypto-js/sha1');
const encHex = require('crypto-js/enc-hex');


export function saveVersion(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }

	const userID = req.user._id;
	const now = new Date().getTime();
	const newVersion = req.body.newVersion;

	const version = new Version({
		type: newVersion.type,
		hash: undefined,
		message: newVersion.message,
		parent: newVersion.parent,
		createdBy: userID,
		createDate: now,
		content: newVersion.content || {},
		isPublished: newVersion.isPublished || false,
	});


	version.save() // Save new version data
	.then(function(savedVersion) { // Add to atom versions array and return version
		Atom.update({ _id: newVersion.parent }, { $addToSet: { versions: savedVersion._id} }, function(errUpdating, resultUpdate) {if (errUpdating) return console.log(errUpdating);});
		return res.status(201).json(savedVersion);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/saveVersion', saveVersion);
