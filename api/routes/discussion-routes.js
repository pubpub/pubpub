const app = require('../api');

const Pub = require('../models').Pub;
const User = require('../models').User;
const Asset = require('../models').Asset;
const Discussion = require('../models').Discussion;
// const Reference = require('../models').Reference;
// const Highlight = require('../models').Highlight;
const Notification = require('../models').Notification;

export function addDiscussion(req, res) {
	const currentDate = new Date().getTime();

	const newDiscussion = new Discussion({});
	newDiscussion.author = req.user._id;
	newDiscussion.markdown = req.body.discussionObject.markdown;
	newDiscussion.history = [{
		markdown: req.body.discussionObject.markdown,
		datePosted: currentDate,
		version: req.body.discussionObject.version,
	}];

	newDiscussion.parent = req.body.discussionObject.parent;
	newDiscussion.children = [];

	newDiscussion.pub = req.body.discussionObject.pub;
	newDiscussion.version = req.body.discussionObject.version;
	newDiscussion.sourceJournal = req.body.discussionObject.sourceJournal;

	newDiscussion.createDate = currentDate;
	newDiscussion.lastUpdated = currentDate;

	newDiscussion.archived = false;
	newDiscussion.private = req.body.discussionObject.private;

	newDiscussion.yays = [];
	newDiscussion.nays = [];


	newDiscussion.save(function(err, result) {
		if (err) { return res.status(500).json(err); }
		const discussionID = result.id;
		const userID = result.author;
		const pubID = result.pub;

		// Update Asset docs to reflect that they were used in this discussion
		const assetIDStrings = req.body.discussionObject.markdown.match(/"_id":"(.*?)"/g) || [];
		const assetIDs = assetIDStrings.map((string)=>{
			return string.substring(7, string.length - 1);
		});
		Asset.update({'_id': {$in: assetIDs}}, { $addToSet: { usedInDiscussions: {id: result._id, version: 1}} }, function(assetUpdateErr, updateResult) {if (assetUpdateErr) return console.log('Failed to update assets usedInDiscussionss field'); });

		User.update({ _id: userID }, { $addToSet: { discussions: discussionID} }, function(errUpdate, resultUpdate) {if (errUpdate) return console.log(errUpdate);});
		Pub.update({ _id: pubID }, { $addToSet: { discussions: discussionID} }, function(errUpdate, resultUpdate) {if (errUpdate) return console.log(errUpdate);});
		Discussion.update({_id: result.parent}, { $addToSet: { children: discussionID} }, function(errUpdate, resultUpdate) {if (errUpdate) return console.log(errUpdate);});

		// Notify all the pub authors
		// Notify the author of a parent comment
		Pub.findOne({_id: pubID}, {authors: 1}).lean().exec(function(errPubFind, pub) {
			if (!pub) { return res.status(500).json('commenting on non-existant pub'); }
			
			pub.authors.map((author)=>{
				Notification.createNotification('discussion/pubComment', req.body.host, userID, author, pubID, discussionID);
			});

			if (result.parent && !result.private) { // Don't notify parent author if reply is private. We don't want a public comment being told about private responses.
				Discussion.findOne({_id: result.parent}, {author: 1}).lean().exec(function(errDiscussionFind, parentDiscussion) {
					Notification.createNotification('discussion/repliedTo', req.body.host, userID, parentDiscussion.author, pubID, discussionID);
				});
			}

			const populateQuery = [
				{path: 'author', select: '_id name username firstName lastName thumbnail'},
				// {path:'selections'},
			];

			Discussion.populate(result, populateQuery, function(errDiscPopulate, populatedResult) {
				if (err) { return res.status(500).json(err); }
				res.status(201).json(populatedResult);
			});

		});


	});
}
app.post('/addDiscussion', addDiscussion);

export function updateDiscussion(req, res) {
	Discussion.findOne({ _id: req.body.updatedDiscussion._id }, function(err, discussion) {
		const currentDate = new Date().getTime();
		discussion.markdown = req.body.updatedDiscussion.markdown;
		discussion.history.push({
			markdown: req.body.updatedDiscussion.markdown,
			datePosted: currentDate,
			version: req.body.updatedDiscussion.version,
		});

		discussion.version = req.body.updatedDiscussion.version;
		discussion.lastUpdated = currentDate;

		// Update Asset docs to reflect that they were used in this pub
		const assetIDStrings = req.body.newVersion.markdown.match(/"_id":"(.*?)"/g) || [];
		const assetIDs = assetIDStrings.map((string)=>{
			return string.substring(7, string.length - 1);
		});
		Asset.update({'_id': {$in: assetIDs}}, { $addToSet: { usedInDiscussions: {id: discussion._id, version: discussion.history.length || 1}} }, function(assetUpdateErr, updateResult) {if (assetUpdateErr) return console.log('Failed to update assets usedInDiscussionss field'); });

		discussion.save(function(errSave, result) {
			if (errSave) { return res.status(500).json(errSave); }

			const populateQuery = [
				{path: 'author', select: '_id name username firstName lastName thumbnail'},
				// {path:'selections'},
			];

			Discussion.populate(result, populateQuery, function(errPop, populatedResult) {
				if (errPop) { return res.status(500).json(errPop); }
				res.status(201).json(populatedResult);
			});

		});
	});
}
app.post('/updateDiscussion', updateDiscussion);

export function voteDiscussion(req, res) {
	if (!req.user) {return res.status(504).json('Not logged in');}

	const userID = req.user._id;
	const discussionID = req.body.discussionID;
	const userYay = req.body.userYay;
	const userNay = req.body.userNay;
	const type = req.body.type;

	if (type === 'yay' && !userYay) {
		Discussion.update({_id: discussionID}, { $addToSet: { yays: userID} }, function(err, result) {if (err) return console.log(err);});
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $addToSet: { yays: discussionID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result) {if (err) return console.log(err);});
	} else if (type === 'yay' && userYay) {
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result) {if (err) return console.log(err);});
	} else if (type === 'nay' && !userNay) {
		Discussion.update({_id: discussionID}, { $addToSet: { nays: userID} }, function(err, result) {if (err) return console.log(err);});
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $addToSet: { nays: discussionID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result) {if (err) return console.log(err);});
	} else if (type === 'nay' && userNay) {
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result) {if (err) return console.log(err);});
	}

	return res.status(201).json(true);
}
app.post('/voteDiscussion', voteDiscussion);

export function archiveDiscussion(req, res) {
	if (!req.user) {return res.status(504).json('Not logged in');}

	const discussionID = req.body.objectID;

	Discussion.findOne({_id: discussionID}).exec(function(err, discussion) {

		discussion.archived = !discussion.archived;

		discussion.save(function(errSave, result) {
			return res.status(201).json(result);
		});
	});

}
app.post('/archiveDiscussion', archiveDiscussion);
