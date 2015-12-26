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

app.get('/autocompletePubsAll', function(req,res){
	var objects = [];
	var query = {history: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};

	Pub.find(query, {'slug':1, 'title':1, 'abstract': 1}).exec(function (err, pubs) {
		objects = pubs;
		// console.log(objects);
		var sifter = new Sifter(objects);

		var result = sifter.search(req.query.string, {
		    fields: ['slug', 'title'],
		    sort: [{field: 'title', direction: 'asc'}],
		    limit: 10
		});

		var output = [];
		_.each(result.items, function(item){
			output.push(objects[item.id]);
		});
		return res.status(201).json(output)
	});
});

app.get('/autocompletePubs', function(req,res){
	var query = {versions: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};
	if(req.query.journalID){
		query['featuredInJournalsList'] = req.query.journalID;
	}
	Pub.find(query, {'displayTitle':1, 'uniqueTitle':1, 'image':1, 'featuredInJournalsList':1}).exec(function (err, pubs) {
	objects = pubs;
	// console.log(objects);
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

app.get('/autocompletePubsAndUsers', function(req,res){
	var objects = [];

	User.find({}, {'_id':1,'username':1, 'thumbnail':1, 'name':1}).lean().exec(function (err, users) {
		if(users){
			objects = objects.concat(users);	
		}
		
		Pub.find({history: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}}, {'_id':0,'slug':1, 'title':1}).exec(function (err, pubs) {
			if(pubs){
				objects = objects.concat(pubs);			
			}
			
			
			// console.log(objects)
			var sifter = new Sifter(objects);

			var result = sifter.search(req.query.string, {
			    fields: ['username', 'name', 'slug', 'title'],
			    sort: [{field: 'username', direction: 'asc'}, {field: 'title', direction: 'asc'}],
			    limit: 10
			});

			var output = [];
			_.each(result.items, function(item){
				output.push(objects[item.id]);
			});
			return res.status(201).json(output)
		});

	});
});

app.get('/autocompleteReferences', function(req,res){
	return res.status(201).json(['cat','dog','fish']);
});
