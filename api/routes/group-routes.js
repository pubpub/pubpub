var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Group = require('../models').Group;


// app.post('/discussionVote', function(req,res){
// 	if (!req.user) {return res.status(504).json('Not logged in');}


// 	return res.status(201).json(true);
// });
