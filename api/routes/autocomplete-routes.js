var app    = require('../api');
var Sifter = require('sifter');
var _      = require('underscore');

var Pub = require('../models').Pub;
var User = require('../models').User;
var Journal = require('../models').Journal;
var Group = require('../models').Group;

app.get('/autocompleteJournals', function(req,res){
	Journal.find({}, {'_id':1,'journalName':1, 'subdomain':1, 'customDomain':1, 'design': 1}).exec(function (err, journals) {
		var objects = journals;
		var sifter = new Sifter(objects);

		var result = sifter.search(req.query.string, {
		    fields: ['journalName', 'customDomain', 'subdomain'],
		    sort: [{field: 'journalName', direction: 'asc'}],
		    limit: 10
		});

		var output = [];
		_.each(result.items, function(item){
			output.push(objects[item.id]);
		});

		return res.status(201).json(output);
	});
});

app.get('/autocompleteUsers', function(req,res){
	User.find({}, {'_id':1,'username':1, 'thumbnail':1, 'name':1}).exec(function (err, users) {
		var objects = users;
		var sifter = new Sifter(objects);

		var result = sifter.search(req.query.string, {
		    fields: ['username', 'name'],
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
	// If we don't want to have to pass up journalID from the call,
	// We could just take the host appended to the query by the middleware,
	// look up the journal based on that, and then grab the ID.
	// Requires an extra db call - but may be client side

	var objects = [];
	var query = {history: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};
	if(req.query.journalID){
		query['featuredInList'] = req.query.journalID;
	}

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

app.get('/autocompleteUsersAndGroups', function(req,res){
	var objects = [];

	User.find({}, {'_id':1,'username':1, 'thumbnail':1, 'name':1}).lean().exec(function (err, users) {
		if(users){
			objects = objects.concat(users);	
		}
		
		Group.find({}, {'_id':1,'groupName':1, 'groupSlug':1}).lean().exec(function (err, groups) {
			if(groups){
				objects = objects.concat(groups);			
			}
			
			
			// console.log(objects)
			var sifter = new Sifter(objects);

			var result = sifter.search(req.query.string, {
			    fields: ['username', 'name', 'groupName', 'groupSlug'],
			    sort: [{field: 'name', direction: 'asc'}, {field: 'groupName', direction: 'asc'}],
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
