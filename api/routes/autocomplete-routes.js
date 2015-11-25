var app    = require('../api');
var Sifter = require('sifter');
var _      = require('underscore');

var Pub = require('../models').Pub;
var User = require('../models').User;

app.get('/autocompleteUsers', function(req,res){
	User.find({}, {'_id':1,'username':1, 'thumbnail':1, 'email':1, 'name':1}).exec(function (err, users) {
		var objects = users;
		var sifter = new Sifter(objects);

		var result = sifter.search(req.query.string, {
		    fields: ['username', 'email', 'name'],
		    sort: [{field: 'username', direction: 'asc'}],
		    limit: 10
		});

		var output = [];
		_.each(result.items, function(item){
			output.push(objects[item.id]);
		});

		return res.status(201).json(output);
	});
});

app.get('/autocompletePubs', function(req,res){
	var query = {versions: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};
	if(req.query.journalID){
		query['featuredInJournalsList'] = req.query.journalID;
	}
	Pub.find(query, {'displayTitle':1, 'uniqueTitle':1, 'image':1, 'featuredInJournalsList':1}).exec(function (err, pubs) {
	objects = pubs;
	console.log(objects);
		var sifter = new Sifter(objects);

		var result = sifter.search(req.query.string, {
		    fields: ['uniqueTitle', 'displayTitle'],
		    sort: [{field: 'uniqueTitle', direction: 'asc'}],
		    limit: 10
		});

		var output = [];
		_.each(result.items, function(item){
			output.push(objects[item.id]);
		});
		return res.status(201).json(output)
	});
});
