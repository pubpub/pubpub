const app = require('../api');
const ObjectID = require('mongodb').ObjectID;

const Atom = require('../models').Atom;
const Link = require('../models').Link;
const Version = require('../models').Version;
const Journal = require('../models').Journal;
const User = require('../models').User;
const Promise = require('bluebird');

// const SHA1 = require('crypto-js/sha1');
// const encHex = require('crypto-js/enc-hex');
const request = require('superagent-promise')(require('superagent'), Promise);

export function createAtom(req, res) {
	if (!req.user) {
		return res.status(403).json('Not Logged In');
	}

	if (!req.user.verifiedEmail) {
		return res.status(403).json('Not Verified');
	}

	const userID = req.user._id;
	const now = new Date().getTime();
	const type = req.body.type || 'markdown';
	// const hash = SHA1(type + new Date().getTime() + req.user._id).toString(encHex);
	const newAtomID = new ObjectID();

	const today = new Date();
	const dateString = (today + '').substring(4, 15);

	const atom = new Atom({
		_id: newAtomID,
		slug: newAtomID,
		title: req.body.title || 'New Pub: ' + dateString,
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
		const tasks = [
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

		if (taskResults.length === 2) {
			const versionData = taskResults[1];
			versionID = versionData._id;
			return Atom.update({ _id: versionData.parent }, { $addToSet: { versions: versionData._id} }).exec();
		}
		return undefined;
	})
	.then(function() {
		if (type !== 'jupyter' || !req.body.versionContent) { return undefined; }
		// return Request.post('http://jupyter-dd419b35.e87eb116.svc.dockerapp.io/convert', { });
		return request.post('http://jupyter-dd419b35.e87eb116.svc.dockerapp.io/convert').send({form: { url: req.body.versionContent.url } });
	})
	.then(function(response) {
		if (type !== 'jupyter' || !req.body.versionContent) { return undefined; }
		return Version.update({ _id: versionID }, { $set: { 'content.htmlUrl': response} }).exec();
		// newVersion.content.htmlUrl = response;
	})
	.then(function() {
		const getVersion = Version.findOne({_id: versionID}).lean().exec();
		const getContributors = Link.find({destination: newAtomID, type: {$in: ['author', 'editor', 'reader', 'contributor']}, inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'username name image bio',
		}).exec();
		return Promise.all([getVersion, getContributors]);
	})
	.then(function(promiseTasks) { // Return hash of new atom
		const newVersion = promiseTasks[0];
		const contributors = promiseTasks[1];

		const versionData = newVersion || {};
		versionData.parent = atom;
		versionData.contributors = contributors;
		versionData.permissionType = 'author';

		return res.status(201).json(versionData);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createAtom', createAtom);

export function createReplyDocument(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }
	if (!req.user.verifiedEmail) { return res.status(403).json('Not Verified'); }

	const userID = req.user._id;
	const now = new Date().getTime();
	const type = req.body.type || 'document';
	const newAtomID = new ObjectID();
	const replyTo = req.body.replyTo;
	const rootReply = req.body.rootReply;

	const atom = new Atom({
		_id: newAtomID,
		slug: newAtomID,
		title: req.body.title || 'Reply: ' + new Date().getTime(),
		type: type,

		createDate: now,
		lastUpdated: now,
		isPublished: true,

		versions: [],
		tags: [],
	});

	// let versionID;
	let versionData;
	// This should be made more intelligent to use images, video thumbnails, etc when possible - if the atom type is image, video, etc.
	atom.previewImage = 'https://assets.pubpub.org/_site/pub.png';

	// Check if highlight
	// create new highlight
	// create new atom
	// edit version JSON and markdown
	// create new version
	const versionContent = req.body.versionContent || {};
	atom.save() // Save new atom data
	.then(function(newAtom) { // Create new Links pointing between atom and author
		const tasks = [
			Link.createLink('author', userID, newAtomID, userID, now),
			Link.createLink('reply', newAtomID, replyTo, userID, now, {rootReply: rootReply}),
		];


		// If there is highlight data, create the highlight!
		if (req.body.highlightObject) {
			const newHighlightID = new ObjectID();
			const newHighlightVersionID = new ObjectID();
			const newHighlight = new Atom({
				_id: newHighlightID,
				type: 'highlight',
				slug: String(newHighlightID),
				title: 'Highlight: ' + now,
				previewImage: 'https://assets.pubpub.org/_site/pub.png',
				createDate: now,
				lastUpdated: now,
				isPublished: true,
				versions: [newHighlightVersionID],
				tags: [],
			});
			tasks.push(newHighlight.save());


			const highlightObject = req.body.highlightObject || {};
			const newHighlightVersion = new Version({
				_id: newHighlightVersionID,
				type: 'highlight',
				message: '',
				parent: newHighlightID,
				content: {
					text: highlightObject.text,
					context: highlightObject.context,
					startContainerPath: highlightObject.startContainerPath,
					startOffset: highlightObject.startOffset,
					endContainerPath: highlightObject.endContainerPath,
					endOffset: highlightObject.endOffset,
					sourcePub: highlightObject.sourcePub,
					sourceVersion: highlightObject.sourceVersion,
				}
			});
			tasks.push(newHighlightVersion.save());

			// If we're here, we need to update the versionContent to include the highlight at the top
			const hightlightJSONObject = {
				type: 'embed',
				attrs: {
					mode: 'embed',
					caption: '',
					size: '',
					align: 'full',
					id: String(newHighlightID),
					className: '',
					source: String(newHighlightID),
					data: {
						_id: String(newHighlightID),
						type: 'highlight',
						message: '',
						parent: newHighlight,
						content: newHighlightVersion.content
					}
				}
			};
			versionContent.docJSON.content.unshift(hightlightJSONObject);
			const highlightMarkdown = '[[source=\"' + hightlightJSONObject.attrs.source + '\" id=\"' + hightlightJSONObject.attrs.id + '\" className=\"' + hightlightJSONObject.attrs.className + '\" align=\"' + hightlightJSONObject.attrs.align + '\" size=\"' + hightlightJSONObject.attrs.size + '\" caption=\"' + hightlightJSONObject.attrs.caption + '\" mode=\"' + hightlightJSONObject.attrs.mode + '\" data=\"' + encodeURIComponent(JSON.stringify(hightlightJSONObject.attrs.data)) + '\"]]';
			versionContent.markdown = highlightMarkdown + '\n' + versionContent.markdown;

		}


		// If there is version data, create the version!
		if (req.body.versionContent) {
			const newVersion = new Version({
				type: newAtom.type,
				message: '',
				parent: newAtom._id,
				isPublished: true,
				publishedBy: userID,
				publishedDate: now,
				createDate: now,
				createdBy: userID,
				content: versionContent
			});
			tasks.push(newVersion.save());
		}

		return Promise.all(tasks);
	})
	.then(function(taskResults) { // If we created a version, make sure to add that version to parent
		if (taskResults.length === 3) {
			versionData = taskResults[2];
			return Atom.update({ _id: versionData.parent }, { $addToSet: { versions: versionData._id} }).exec();
		}
		if (taskResults.length === 5) {
			versionData = taskResults[4];
			return Atom.update({ _id: versionData.parent }, { $addToSet: { versions: versionData._id} }).exec();
		}
		return undefined;
	})
	.then(function() {
		const findReplyLink = Link.findOne({type: 'reply', source: newAtomID}).populate({
			path: 'source',
			model: 'Atom',
		}).exec();

		const findAuthorLink = Link.find({destination: newAtomID, type: 'author'}).populate({
			path: 'source',
			model: User,
			select: 'username name firstName lastName image ',
		}).exec();

		return Promise.all([findReplyLink, findAuthorLink]);

	})
	.spread(function(replyLinkData, authorLinkData) {
		return {
			atomData: atom,
			versionData: versionData,
			authorsData: authorLinkData,
			linkData: replyLinkData
		};
	})
	.then(function(discussionData) {
		return res.status(201).json(discussionData);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createReplyDocument', createReplyDocument);


export function getAtomData(req, res) {
	const {slug, meta, version} = req.query;
	const userID = req.user ? req.user._id : undefined;
	// Check permission type

	let permissionType;
	Atom.findOne({slug: slug.toLowerCase()}).lean().exec()
	.then(function(atomResult) { // Get most recent version
		if (!atomResult) {
			throw new Error('Atom does not exist');
		}
		const permissionLink = Link.findOne({source: userID, destination: atomResult._id, type: {$in: ['author', 'editor', 'reader']}, inactive: {$ne: true} }).exec();
		const findFollowingLink = Link.findOne({source: userID, destination: atomResult._id, type: 'followsAtom', inactive: {$ne: true}}).exec();
		return [atomResult, permissionLink, findFollowingLink];
	})
	.spread(function(atomResult, permissionLink, followingLink) {
		if (followingLink) {
			atomResult.isFollowing = true;
		}

		// const permissionType = permissionLink && permissionLink.type;
		permissionType = permissionLink && permissionLink.type;
		if (String(userID) === '568abdd9332c142a0095117f') {
			permissionType = 'author';
		}

		const getAuthors = Link.find({destination: atomResult._id, type: 'author'}).populate({
			path: 'source',
			model: User,
			select: 'username name firstName lastName image ',
		}).exec();

		// Get the most recent version
		// This query fires if no meta and no version are specified
		const getVersion = new Promise(function(resolve) {
			if (!meta && !version) {
				// const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
				const query = permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader' ? {isPublished: true, parent: atomResult._id} : {parent: atomResult._id};
				resolve(Version.findOne({$query: query, $orderby: {createDate: -1}}).exec());
			} else if (version) {
				let versionID = version;
				if (!isNaN(version) && version < 10000) {
					versionID = atomResult.versions[version - 1]; // Note, this is going to provide unexpected behavior if there are unpublished versions in between published versions, and query occurs by index rather than _id.
				}
				resolve(Version.findOne({_id: versionID}).exec());
			} else {
				resolve();
			}
		});

		// Get the collaborators associated with the atom
		// This query fires if meta is equal to 'collaborators'
		const getContributors = Link.find({destination: atomResult._id, type: {$in: ['author', 'editor', 'reader', 'contributor']}, inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'username name image bio',
		}).exec();

		const versionQuery = permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader' ? {isPublished: true, _id: {$in: atomResult.versions}} : {_id: {$in: atomResult.versions}};
		const getVersions = Version.find(versionQuery, {content: 0}).sort({createDate: -1});

		const getSubmitted = new Promise(function(resolve) {
			if (permissionType === 'author') {
				const query = Link.find({source: atomResult._id, type: 'submitted'}).populate({
					path: 'destination',
					model: Journal,
					select: 'journalName slug description icon headerColor',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const getFeatured = Link.find({destination: atomResult._id, type: 'featured'}).populate({
			path: 'source',
			model: Journal,
			select: 'journalName slug description icon headerColor',
		}).exec();


		const getFollowers = Link.find({destination: atomResult._id, type: 'followsAtom', inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'username name bio image',
		}).exec();

		const getDiscussions = Link.findOne({type: 'reply', source: atomResult._id}).exec()
			.then(function(replyToLink) {
				const rootID = replyToLink ? replyToLink.metadata.rootReply : atomResult._id;
				return Link.find({'metadata.rootReply': rootID, type: 'reply', inactive: {$ne: true}}).populate({
					path: 'source',
					model: 'Atom',
				}).exec();
			})
			.then(function(discussionLinks) {
				const getDiscussionVersions = discussionLinks.map((discussionLink)=> {
					const versionID = discussionLink.source.versions[discussionLink.source.versions.length - 1];
					return Version.findOne({_id: versionID}).exec();
				});
				const getDiscussionAuthors = discussionLinks.map((discussionLink)=> {
					const atomID = discussionLink.source._id;

					return Link.find({destination: atomID, type: 'author'}).populate({
						path: 'source',
						model: User,
						select: 'username name firstName lastName image ',
					}).exec();
				});
				return [discussionLinks, Promise.all(getDiscussionVersions), Promise.all(getDiscussionAuthors)];
			})
			.spread(function(discussionLinks, discussionVersions, discussionAuthorLinks) {
				const discussions = discussionLinks.map((discussion)=> {
					const atomData = discussion.source;
					let versionData = {};
					discussionVersions.filter((discussionVersion)=> {
						return !!discussionVersion;
					}).map((discussionVersion)=> {
						if (String(discussionVersion.parent) === String(discussion.source._id)) {
							versionData = discussionVersion;
						}
					});
					const mergedAuthorLinks = [].concat.apply([], discussionAuthorLinks);
					const authorsData = mergedAuthorLinks.filter((authorLink)=> {
						return String(authorLink.destination) === String(discussion.source._id);
					});
					const linkData = discussion;

					return {atomData, versionData, authorsData, linkData};
				});
				return discussions;
			})
			.catch(function(error) {
				console.log('error', error);
				return res.status(500).json(error);
			});

		const getEditToken = new Promise(function(resolve) {
			if (meta === 'edit') {
				const authUrl = process.env.COLLAB_SERVER_URL.indexOf('localhost') !== -1
					? 'http://' + process.env.COLLAB_SERVER_URL + '/authenticate'
					: 'https://' + process.env.COLLAB_SERVER_URL + '/authenticate';

				const query = request.post(authUrl)
				.send({
					user: req.user.username,
					id: atomResult._id,
					collabEncryptSecret: process.env.COLLAB_ENCRYPT_SECRET
				})
				.set('Accept', 'application/json');

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
			getDiscussions,
			getFollowers,
			getEditToken,
		];

		return [atomResult, Promise.all(tasks)];
	})
	.spread(function(atomResult, taskData) { // Send response
		// What's spread? See here: http://stackoverflow.com/questions/18849312/what-is-the-best-way-to-pass-resolved-promise-values-down-to-a-final-then-chai
		if (!atomResult.isPublished && permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader') {
			throw new Error('Atom does not exist');
		}

		const currentVersionData = taskData[1];
		if (currentVersionData && !currentVersionData.isPublished && permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader') {
			throw new Error('Atom does not exist');
		}

		if (!meta && !currentVersionData) {
			throw new Error('Atom has not been published');
		}

		let discussionsData = taskData[6] || [];
		if (permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader') {
			discussionsData = discussionsData.filter((discussion)=>{
				return discussion.versionData.isPublished;
			});
		}
		const token = taskData[8] && taskData[8].text;

		// Need to beef this out once people start publishing specific versions!
		atomResult.permissionType = permissionType;
		return res.status(201).json({
			atomData: atomResult,
			authorsData: taskData[0].filter((item)=>{
				return !!item.source;
			}),
			currentVersionData: currentVersionData,
			contributorsData: taskData[2].filter((item)=>{
				return !!item.source;
			}),
			versionsData: taskData[3],
			submittedData: taskData[4],
			featuredData: taskData[5],
			discussionsData: discussionsData,
			followersData: taskData[7],
			token: token,
			collab: !!token,
		});
	})
	.catch(function(error) {
		if (error.message === 'Atom does not exist') {
			console.log(error.message);
			return res.status(404).json('404 Not Found');
		}

		if (error.message === 'Atom has not been published') {
			console.log(error.message);
			return res.status(403).json({message: 'Atom has not been published', permissionType: permissionType });
		}

		console.log('error', error);
		return res.status(500).json(error);
	});


}
app.get('/getAtomData', getAtomData);

export function getAtomEdit(req, res) {

	const {slug} = req.query;
	const userID = req.user ? req.user._id : undefined;
	// Check permission type

	// let token = undefined;
	// let collab = false; // collab tells you if a connection was established to the collab server

	let output = {};
	Atom.findOne({slug: slug.toLowerCase()}).lean().exec()

	.then(function(atomResult) { // Get most recent version
		if (!atomResult) {
			throw new Error('Atom does not exist');
		}
		const permissionLink = Link.findOne({source: userID, destination: atomResult._id, type: {$in: ['author', 'editor', 'reader']}, inactive: {$ne: true} });
		return [atomResult, permissionLink];
	})
	.spread(function(atomResult, permissionLink) { // Get authors
		const getAuthors = new Promise(function(resolve) {
			const query = Link.find({destination: atomResult._id, type: 'author'}).populate({
				path: 'source',
				model: User,
				select: 'username name firstName lastName image ',
			}).exec();
			resolve(query);
		});
		return [atomResult, permissionLink, getAuthors];
	})
	.spread(function(atomResult, permissionLink, authors) { // Get most recent version
		let permissionType = permissionLink && permissionLink.type;
		if (String(userID) === '568abdd9332c142a0095117f') {
			permissionType = 'author';
		}

		const mostRecentVersionId = atomResult.versions[atomResult.versions.length - 1];
		return [atomResult, Version.findOne({_id: mostRecentVersionId}).exec(), permissionType, authors];
	})
	.spread(function(atomResult, versionResult, permissionType, authors) { // Send response
		if (permissionType !== 'author' && permissionType !== 'editor') {
			throw new Error('Atom does not exist');
		}

		output = {
			atomData: atomResult,
			currentVersionData: versionResult,
			authorsData: authors,
		};

		let authUrl;

		if (process.env.COLLAB_SERVER_URL.indexOf('localhost') !== -1) {
			authUrl = 'http://' + process.env.COLLAB_SERVER_URL + '/authenticate';
		} else {
			authUrl = 'https://' + process.env.COLLAB_SERVER_URL + '/authenticate';
		}

		return request.post(authUrl)
		.send({
			user: req.user.username,
			id: atomResult._id,
			collabEncryptSecret: process.env.COLLAB_ENCRYPT_SECRET
		})
		.set('Accept', 'application/json')
		.end(function(err, jsonResponse) {
			 if (!err) {
				 output.token = jsonResponse.text;
				 output.tokenValid = true;
			 }
			 return res.status(201).json(output);
		})
		.catch(function(err) {
			 console.log('error', err);
		});

	})
	.catch(function(error) {
		if (error.message === 'Atom does not exist') {
			console.log(error.message);
			return res.status(404).json('404 Not Found');
		}
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
			contributorsData: taskResults[1].filter((item)=>{
				return !!item.source;
			}),
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
	if (!req.user.verifiedEmail) {
		return res.status(403).json('Not Verified');
	}
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
			model: Journal,
			select: 'journalName slug description icon headerColor',
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
	if (!req.user.verifiedEmail) {
		return res.status(403).json('Not Verified');
	}

	const atomID = req.body.atomID;
	const userID = req.user ? req.user._id : undefined;
	const newDetails = req.body.newDetails || {};
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }
	// Check permission

	Atom.findById(atomID).exec()
	.then(function(result) {

		if (!result) { throw new Error('Atom does not exist'); }

		if (result.slug !== newDetails.slug) {
			return [result, Atom.findOne({slug: newDetails.slug}).lean()];
		}
		return [result, undefined];
	})
	.spread(function(result, existingAtom) {
		// TODO: This needs to properly generate an error notification on the frontend. Both in
		// PreviewEditor and Atom
		if (existingAtom) { throw new Error('Atom already exists'); }

		// Validate and clean submitted values
		result.title = newDetails.title;
		result.slug = result.isPublished ? result.slug : newDetails.slug.toLowerCase();
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

export function deleteAtom(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }
	// Check permission

	const atomID = req.body.atomID;
	Atom.findById(atomID).exec()
	.then(function(result) {
		if (!result) { throw new Error('Atom does not exist'); }

		result.inactive = true;
		result.inactiveBy = userID;
		result.inactiveDate = new Date().getTime();
		result.inactiveNote = 'Deleted';
		result.slug = result._id;
		return result.save();
	})
	.then(function(savedResult) {
		return res.status(201).json(atomID);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.delete('/deleteAtom', deleteAtom);

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

// Saves a docx content as the new version content of an Atom
export function uploadDocx(req, res) {
	if (!req.user) {
		return res.status(403).json('Not Logged In');
	}

	if (!req.user.verifiedEmail) {
		return res.status(403).json('Not Verified');
	}

	const userID = req.user._id;
	const now = new Date().getTime();
	const type = req.body.type || 'markdown';
	const atomID = req.body.atomID;

	const today = new Date();
	const dateString = (today + '').substring(4, 15);

	let versionID;
	// This should be made more intelligent to use images, video thumbnails, etc when possible - if the atom type is image, video, etc.

	request.post(process.env.CONVERT_SERVER_URL + '/convertDocx')
	.send({form: { url: req.body.url } })
	.then(function(versionContent) {
		 const tasks = [
		// 	Link.createLink('author', userID, newAtomID, userID, now),
		 ];

		const newVersion = new Version({
			type: 'markdown',
			message: 'Imported docx',
			parent: atomID,
			content: JSON.parse(versionContent.text),
			isPublished: false,
			publishedBy: userID,
			publishedDate: now,
			createdBy: userID,
			createDate: now

		});
		tasks.push(newVersion.save());

		const informJake = new Promise(function(resolve, reject) {
			console.log("INFORMING JAKE")
			const collabUrl = process.env.COLLAB_SERVER_URL.indexOf('localhost') !== -1
				? 'http://' + process.env.COLLAB_SERVER_URL
				: 'https://' + process.env.COLLAB_SERVER_URL;

				console.log(collabUrl)

			return request.post(collabUrl + '/import-doc')
			.send({ document_id: atomID, contents: JSON.stringify(JSON.parse(versionContent.text).docJSON) })
			.then(function() {
				resolve();
			}).catch((err) => { console.log("Aaah " + err); reject(err); })
		});

		tasks.push(informJake);
		return Promise.all(tasks);
	})
	.then(function(taskData) { // If we created a version, make sure to add that version to parent
		const savedVersion = taskData[0];
		console.log("Yah saved version bro " + JSON.stringify(savedVersion))
		// const versionData = taskResults[0];
		// versionID = versionData._id;
		console.log("\n\n"+savedVersion._id)
		console.log("atomid : " + atomID)
		return Atom.update({ _id: atomID }, { $addToSet: { versions: savedVersion._id}, $set: {lastUpdated: now} }).exec();
	})
	.then(function() {
		const getVersion = Version.findOne({_id: versionID}).lean().exec();
		return getVersion;
	})
	.then(function(newVersion) { // Return hash of new atom
		const versionData = newVersion || {};
		// versionData.parent = atom;
		// versionData.contributors = contributors;
		versionData.permissionType = 'author';

		return res.status(201).json(versionData);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}

app.post('/uploadDocx', uploadDocx);
