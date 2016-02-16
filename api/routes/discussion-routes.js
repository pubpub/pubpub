var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Asset = require('../models').Asset;
var Discussion = require('../models').Discussion;
var Reference = require('../models').Reference;
var Highlight = require('../models').Highlight;
var Notification = require('../models').Notification;


var _         = require('underscore');

app.post('/addDiscussion', function(req, res) {
	const postDate = new Date().getTime();

	const newDiscussion = req.body.discussionObject;
	newDiscussion.author = req.user._id;
	newDiscussion.assets = []; // Ingest assets object and spit back array of ObjectIDs
	newDiscussion.references = []; // Ingest references object and spit back array of ObjectIDs
	newDiscussion.sourceJournal = undefined; // We will have to call something to get the journalID of the given host
	newDiscussion.postDate = postDate;
	newDiscussion.yays = [];
	newDiscussion.nays = [];

	// Ingest selections object and spit back array of ObjectIDs
	const selections = [];
	for (const key in req.body.discussionObject.selections) { 
		const selectionObject = req.body.discussionObject.selections[key];
		selectionObject.author = req.user._id;
		selectionObject.postDate = postDate;
		selectionObject.index = key;
		selectionObject.usedInDiscussion = true;
		selections.push(selectionObject);
	}

	Highlight.insertBulkAndReturnIDs(selections, function(err, selectionIds){
		if (err) { return res.status(500).json(err);  }

		newDiscussion.selections = selectionIds;

		const discussion = new Discussion(newDiscussion);
		discussion.save(function (err, result) {
			if (err) { return res.status(500).json(err);  }
			var discussionID = result.id;
			var userID = result.author;
			var pubID = result.pub;

			if (req.body.isEditorComment) {
				// console.log('got an editor comment!');
				Pub.update({ _id: pubID }, { $addToSet: { editorComments: discussionID} }, function(err, result){if(err) return handleError(err)});
			} else {
				// console.log('got a discussion!');
				Pub.update({ _id: pubID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
				User.update({ _id: userID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
			}
			
			Discussion.update({_id: result.parent}, { $addToSet: { children: discussionID} }, function(err, result){if(err) return handleError(err)});

			// Notify all the pub authors
			// Notify the author of a parent comment
			Pub.findOne({_id: pubID}, {'authors':1}).lean().exec(function (err, pub) {
				pub.authors.map((author)=>{
					Notification.createNotification('discussion/pubComment', req.body.host, userID, author, pubID, discussionID);
				});
			});
			if (result.parent) {
				Discussion.findOne({_id: result.parent}, {'author':1}).lean().exec(function (err, parentDiscussion) {
					Notification.createNotification('discussion/repliedTo', req.body.host, userID, parentDiscussion.author, pubID, discussionID);
				});	
			}
			


			var populateQuery = [
				{path:'author', select:'_id name username firstName lastName thumbnail'},
				{path:'selections'},
			];

			Discussion.populate(result, populateQuery, function(err,populatedResult){
				if (err) { return res.status(500).json(err);  }
				res.status(201).json(populatedResult);
				
			});

		});

	});	

});

app.post('/discussionVote', function(req,res){
	if (!req.user) {return res.status(504).json('Not logged in');}

	const userID = req.user._id;
	const discussionID = req.body.discussionID;
	const userYay = req.body.userYay;
	const userNay = req.body.userNay;
	const type = req.body.type;

	if (type === 'yay' && !userYay) {
		Discussion.update({_id: discussionID}, { $addToSet: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $addToSet: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
	} else if (type === 'yay' && userYay) {
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
	} else if (type === 'nay' && !userNay) {
		Discussion.update({_id: discussionID}, { $addToSet: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $addToSet: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
	} else if (type === 'nay' && userNay) {
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
	}

	return res.status(201).json(true);
});

app.post('/discussionArchive', function(req,res){
	if (!req.user) {return res.status(504).json('Not logged in');}

	const discussionID = req.body.objectID;

	Discussion.findOne({_id:discussionID}).exec(function (err, discussion) {
		
		discussion.archived = !discussion.archived;

		discussion.save(function(err, result){
			return res.status(201).json(result);
		});
	});

});
