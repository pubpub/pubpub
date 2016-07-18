const app = require('../api');

const Atom = require('../models').Atom;
const Version = require('../models').Version;
const Promise = require('bluebird');
const Request = require('request-promise');
import {uploadLocalFile} from '../services/aws';
import {generateMarkdownFile, generatePDFFromJSON} from '../services/exporters';


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
		const updateAtom = Atom.update({ _id: newVersion.parent }, { $addToSet: { versions: savedVersion._id}, $set: {lastUpdated: now} }).exec();
		return [savedVersion, updateAtom];
	})
	.spread(function(savedVersion, updatedAtomResult) {
		if (newVersion.type !== 'document') { return [savedVersion, undefined]; }

		// If it's a document, save PDF, XML, and Markdown
		const tasks = [
			generateMarkdownFile(savedVersion.content.markdown),
			generatePDFFromJSON(savedVersion.content.docJSON),
			// generateXMLFromJSON(savedVersion.content.docJSON),
		];
		return [savedVersion, Promise.all(tasks)];
	})
	.spread(function(savedVersion, taskResults) {
		if (newVersion.type !== 'document') { return [savedVersion, undefined]; }

		const tasks = [
			uploadLocalFile(taskResults[0]),
			uploadLocalFile(taskResults[1]),
			// uploadLocalFile(taskResults[2]),
		];
		return [savedVersion, Promise.all(tasks)];
	})
	.spread(function(savedVersion, taskResults) {
		if (newVersion.type !== 'document') { return [savedVersion, undefined]; }

		savedVersion.content.markdownFile = 'https://assets.pubpub.org/' + taskResults[0];
		savedVersion.content.PDFFile = 'https://assets.pubpub.org/' + taskResults[1];
		// savedVersion.content.XMLFile = 'https://assets.pubpub.org/' + taskResults[2];
		return savedVersion.save();
	})
	.then(function(newSavedVersion) {
		return res.status(201).json(newSavedVersion);
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
		if (!result.isPublished) {
			result.isPublished = true;
			result.publishedBy = userID;
			result.publishedDate = now;	
		}
		return [result, result.save()];
	})
	.spread(function(result, savedResponse) {
		const updateAtom = Atom.update({ _id: result.parent }, { $set: { isPublished: true} }).exec();
		return [result, updateAtom];
	})
	.spread(function(result, updatedAtom) {
		delete result.content;
		return res.status(201).json(result);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/setVersionPublished', setVersionPublished);
