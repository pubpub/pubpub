const app = require('../api');

const Atom = require('../models').Atom;
const Version = require('../models').Version;

const Promise = require('bluebird');

const Request = require('request-promise');


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

	const checkAndSaveJupyter = new Promise(function(resolve) {
		if (newVersion.type === 'jupyter') {
			const query = Request.post('http://jupyter-dd419b35.e87eb116.svc.dockerapp.io/convert', {form: { url: req.body.newVersion.content.url } });
			resolve(query);
		} else {
			resolve();
		}
	});

	checkAndSaveJupyter.then(function(response) {
		if (newVersion.type === 'jupyter') {
			version.content.htmlUrl = response;
		}
		return version.save();
	})
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

export function setVersionPublished(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }

	const userID = req.user._id;
	const now = new Date().getTime();
	const versionID = req.body.versionID;

	Version.findById(versionID).exec()
	.then(function(result) {
		result.isPublished = true;
		result.publishedBy = userID;
		result.publishedDate = now;
		return [result, result.save()];
	})
	.spread(function(result, savedResponse) {
		const updateAtom = Atom.update({ _id: result.parent }, { $set: { isPublished: true} }).exec();
		return [result, updateAtom];
	})
	.spread(function(result, updatedAtom) {
		console.log(result);
		delete result.content;
		return res.status(201).json(result);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/setVersionPublished', setVersionPublished);
