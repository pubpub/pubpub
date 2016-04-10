const app = require('../api');
const Sifter = require('sifter');
const _ = require('underscore');

const Pub = require('../models').Pub;
const User = require('../models').User;
const Journal = require('../models').Journal;
const Group = require('../models').Group;

export function autocompleteJournals(req, res) {
	Journal.find({}, {'_id': 1, 'journalName': 1, 'subdomain': 1, 'customDomain': 1, 'design': 1}).exec(function(err, journals) {
		const objects = journals;
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['journalName', 'customDomain', 'subdomain'],
			sort: [{field: 'journalName', direction: 'asc'}],
			limit: 10
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});

		return res.status(201).json(output);
	});
}
app.get('/autocompleteJournals', autocompleteJournals);

export function autocompleteUsers(req, res) {
	User.find({}, {'_id': 1, 'username': 1, 'thumbnail': 1, 'name': 1}).exec(function(err, users) {
		const objects = users;
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['username', 'name'],
			sort: [{field: 'username', direction: 'asc'}],
			limit: 10
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});

		return res.status(201).json(output);
	});
}
app.get('/autocompleteUsers', autocompleteUsers);

export function autocompletePubsAll(req, res) {
	const query = {history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}};

	Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
		const objects = pubs;
		// console.log(objects);
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['slug', 'title'],
			sort: [{field: 'title', direction: 'asc'}],
			limit: 10
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});
		return res.status(201).json(output);
	});
}
app.get('/autocompletePubsAll', autocompletePubsAll);

export function autocompletePubs(req, res) {
	// If we don't want to have to pass up journalID from the call,
	// We could just take the host appended to the query by the middleware,
	// look up the journal based on that, and then grab the ID.
	// Requires an extra db call - but may be client side

	const query = {history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}};
	if (req.query.journalID) {
		query.featuredInList = req.query.journalID;
	}

	// Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'tags': 1, 'discussions': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
	Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
		const objects = pubs;
		// console.log(objects);
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['slug', 'title'],
			sort: [{field: 'title', direction: 'asc'}],
			limit: 10
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});
		return res.status(201).json(output);
	});
}
app.get('/autocompletePubs', autocompletePubs);

export function autocompletePubsForJournal(req, res) {
	// Similar to autocompletePubs, but infers which journal
	Journal.findOne({ $or: [ {subdomain: req.query.host.split('.')[0]}, {customDomain: req.query.host}]})
	.lean().exec(function(err, journal) {

		const query = {history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}};
		if (journal) {
			query.featuredInList = journal._id;
		}

		// Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'tags': 1, 'discussions': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
		Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(errPubFind, pubs) {
			const objects = pubs;
			// console.log(objects);
			const sifter = new Sifter(objects);

			const result = sifter.search(req.query.string, {
				fields: ['slug', 'title'],
				sort: [{field: 'title', direction: 'asc'}],
				limit: 10
			});

			const output = [];
			_.each(result.items, function(item) {
				output.push(objects[item.id]);
			});
			return res.status(201).json(output);
		});
	});
}
app.get('/autocompletePubsForJournal', autocompletePubsForJournal);

export function autocompletePubsAndUsers(req, res) {
	let objects = [];

	User.find({}, {'_id': 1, 'username': 1, 'thumbnail': 1, 'name': 1}).lean().exec(function(err, users) {
		if (users) {
			objects = objects.concat(users);
		}

		Pub.find({history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}}, {'_id': 0, 'slug': 1, 'title': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err2, pubs) {
			if (pubs) {
				objects = objects.concat(pubs);
			}


			// console.log(objects)
			const sifter = new Sifter(objects);

			const result = sifter.search(req.query.string, {
				fields: ['username', 'name', 'slug', 'title'],
				sort: [{field: 'username', direction: 'asc'}, {field: 'title', direction: 'asc'}],
				limit: 10
			});

			const output = [];
			_.each(result.items, function(item) {
				output.push(objects[item.id]);
			});
			return res.status(201).json(output);
		});

	});
}
app.get('/autocompletePubsAndUsers', autocompletePubsAndUsers);

export function autocompleteUsersAndGroups(req, res) {
	let objects = [];

	User.find({}, {'_id': 1, 'username': 1, 'thumbnail': 1, 'name': 1}).lean().exec(function(err, users) {
		if (users) {
			objects = objects.concat(users);
		}

		Group.find({}, {'_id': 1, 'groupName': 1, 'groupSlug': 1}).lean().exec(function(err2, groups) {
			if (groups) {
				objects = objects.concat(groups);
			}


			// console.log(objects)
			const sifter = new Sifter(objects);

			const result = sifter.search(req.query.string, {
				fields: ['username', 'name', 'groupName', 'groupSlug'],
				sort: [{field: 'name', direction: 'asc'}, {field: 'groupName', direction: 'asc'}],
				limit: 10
			});

			const output = [];
			_.each(result.items, function(item) {
				output.push(objects[item.id]);
			});
			return res.status(201).json(output);
		});

	});
}
app.get('/autocompleteUsersAndGroups', autocompleteUsersAndGroups);

export function autocompleteReferences(req, res) {
	return res.status(201).json(['cat', 'dog', 'fish']);
}
app.get('/autocompleteReferences', autocompleteReferences);
