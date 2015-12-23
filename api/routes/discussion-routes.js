var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Asset = require('../models').Asset;
var Discussion = require('../models').Discussion;
var Reference = require('../models').Reference;
var Highlight = require('../models').Highlight;


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

			Pub.update({ _id: pubID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
			User.update({ _id: userID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
			Discussion.update({_id: result.parent}, { $addToSet: { children: discussionID} }, function(err, result){if(err) return handleError(err)});

			var populateQuery = [
				{path:'author', select:'_id name thumbnail'},
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

	let scoreChange = 0;
	let newUserYay = undefined;
	let newUserNay = undefined;

	if (type === 'yay' && !userYay) {
		Discussion.update({_id: discussionID}, { $addToSet: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $addToSet: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
		scoreChange = userNay ? 2 : 1;
		newUserYay = true;
	} else if (type === 'yay' && userYay) {
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
		scoreChange = -1;
		newUserYay = false;
	} else if (type === 'nay' && !userNay) {
		Discussion.update({_id: discussionID}, { $addToSet: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $addToSet: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
		scoreChange = userYay ? 2 : 1;
		newUserNay = true;
	} else if (type === 'nay' && userNay) {
		Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
		scoreChange = -1;
		newUserNay = false;
	}

	return res.status(201).json({
		discussionID: req.body.discussionID,
		changes: {
			type: type,
			scoreChange: scoreChange,
			newUserYay: newUserYay,
			newUserNay: newUserNay,	
		}
		
	});

});

// app.post('/addyay', function(req,res){
//   // Get discussion
//   // Add user to yays
//   // Remove user from nays
//   // Add discussionID to user Yays
//   // Remove discussionID from user Nays
//   var discussionID = req.body.discussionID;
//   var userID = req.user._id;
//   return Discussion.findById(discussionID)
//     .exec(function (err, discussion) {
//       if (err) return res.json(500);
//       Discussion.update({_id: discussionID}, { $addToSet: { yays: userID} }, function(err, result){if(err) return handleError(err)});
//       Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $addToSet: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       res.status(201).json('true')
//     });
// });

// app.post('/removeyay', function(req,res){
//   // Get discussion
//   // Remove user from yays
//   // Remove discussionID from user Yays
//   var discussionID = req.body.discussionID;
//   var userID = req.user._id;
//   return Discussion.findById(discussionID)
//     .exec(function (err, discussion) {
//       if (err) return res.json(500);
//       Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       res.status(201).json('true')
//     });
// });

// app.post('/addnay', function(req,res){
//   // Get discussion
//   // Add user to nays
//   // Remove user from yays
//   // Add discussionID to user nays
//   // Remove discussionID from user yays
//   var discussionID = req.body.discussionID;
//   var userID = req.user._id;
//   return Discussion.findById(discussionID)
//     .exec(function (err, discussion) {
//       if (err) return res.json(500);
//       Discussion.update({_id: discussionID}, { $addToSet: { nays: userID} }, function(err, result){if(err) return handleError(err)});
//       Discussion.update({_id: discussionID}, { $pull: { yays: userID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $addToSet: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $pull: { yays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       res.status(201).json('true')
//     });
// });


// app.post('/removenay', function(req,res){
//   // Get discussion
//   // Remove user from nays
//   // Remove discussionID from user nays
//   var discussionID = req.body.discussionID;
//   var userID = req.user._id;
//   return Discussion.findById(discussionID)
//     .exec(function (err, discussion) {
//       if (err) return res.json(500);
//       Discussion.update({_id: discussionID}, { $pull: { nays: userID} }, function(err, result){if(err) return handleError(err)});
//       User.update({ _id: userID}, { $pull: { nays: discussionID} }, function(err, result){if(err) return handleError(err)});
//       res.status(201).json('true')
//     });
// });

