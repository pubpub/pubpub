var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Asset = require('../models').Asset;
var Discussion = require('../models').Discussion;
var Reference = require('../models').Reference;
var Highlight = require('../models').Highlight;


var _         = require('underscore');

app.post('/addDiscussion', function(req, res) {

	const newDiscussion = req.body.discussionObject;
	newDiscussion.author = req.user._id;
	newDiscussion.assets = []; // Ingest assets object and spit back array of ObjectIDs
	newDiscussion.selections = []; // Ingest selections object and spit back array of ObjectIDs
	newDiscussion.references = []; // Ingest references object and spit back array of ObjectIDs
	newDiscussion.sourceJournal = undefined; // We will have to call something to get the journalID of the given host
	newDiscussion.postDate = new Date().getTime();
	newDiscussion.yays = [];
	newDiscussion.nays = [];

	const discussion = new Discussion(newDiscussion);

	discussion.save(function (err, result) {
		if (err) { return res.status(500).json(err);  }
		var discussionID = result.id;
		var userID = result.author;
		var pubID = result.pub;

		Pub.update({ _id: pubID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: userID }, { $addToSet: { discussions: discussionID} }, function(err, result){if(err) return handleError(err)});
		Discussion.update({_id: result.parent}, { $addToSet: { children: discussionID} }, function(err, result){if(err) return handleError(err)});

		var populateQuery = [{path:'author', select:'_id name thumbnail'}];

		Discussion.populate(result, populateQuery, function(err,populatedResult){
			if (err) { return res.status(500).json(err);  }
			res.status(201).json(populatedResult);
		});

    });

});

