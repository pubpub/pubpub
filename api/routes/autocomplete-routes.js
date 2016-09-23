const app = require('../api');
const Sifter = require('sifter');
const _ = require('underscore');

// const Pub = require('../models').Pub;
const Atom = require('../models').Atom;
const User = require('../models').User;
const Journal = require('../models').Journal;
const Group = require('../models').Group;


export function autocompleteJournals(req, res) {
	Journal.find({}, {'_id': 1, 'journalName': 1, 'slug': 1, 'logo': 1}).exec(function(err, journals) {
		const objects = journals;
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['journalName', 'slug'],
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
	User.find({}, {'_id': 1, 'username': 1, 'image': 1, 'name': 1, email: 1}).lean().exec(function(err, users) {
		const objects = users;
		const sifter = new Sifter(objects);

		const result = sifter.search(req.query.string, {
			fields: ['username', 'name', 'email'],
			sort: [{field: 'username', direction: 'asc'}],
			limit: 10
		});

		const output = [];
		_.each(result.items, function(item) {
			const newObject = objects[item.id];
			delete newObject.email;
			output.push(newObject);
		});
		return res.status(201).json(output);
	});
}
app.get('/autocompleteUsers', autocompleteUsers);

export function autocompleteAtoms(req, res) {
	Atom.find({versions: {$not: {$size: 0}}, isPublished: true}, {'_id': 1, 'slug': 1, 'title': 1, 'previewImage': 1, 'createDate': 1, 'lastUpdated': 1}).lean().exec()
	.then(function(atoms) {
		const objects = atoms;

		const sifter = new Sifter(objects);
		const result = sifter.search(req.query.string, {
			fields: ['slug', 'title', '_id'],
			sort: [{field: 'title', direction: 'asc'}],
			limit: 10,
			conjunction: 'and',
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});
		return res.status(201).json(output);
	})
	.catch(function(err) {
		console.log('Error in autocomplete', err);
		return res.status(500).json([]);
	});
}
app.get('/autocompleteAtoms', autocompleteAtoms);

// export function autocompletePubsAll(req, res) {
// 	const query = {history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}};

// 	Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
// 		const objects = pubs;
// 		// console.log(objects);
// 		const sifter = new Sifter(objects);

// 		const result = sifter.search(req.query.string, {
// 			fields: ['slug', 'title'],
// 			sort: [{field: 'title', direction: 'asc'}],
// 			limit: 10
// 		});

// 		const output = [];
// 		_.each(result.items, function(item) {
// 			output.push(objects[item.id]);
// 		});
// 		return res.status(201).json(output);
// 	});
// }
// app.get('/autocompletePubsAll', autocompletePubsAll);

// export function autocompletePubs(req, res) {
// 	// If we don't want to have to pass up journalID from the call,
// 	// We could just take the host appended to the query by the middleware,
// 	// look up the journal based on that, and then grab the ID.
// 	// Requires an extra db call - but may be client side

// 	const query = {history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}};
// 	if (req.query.journalID) {
// 		query.featuredInList = req.query.journalID;
// 	}

// 	// Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'tags': 1, 'discussions': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
// 	Pub.find(query, {'slug': 1, 'title': 1, 'abstract': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err, pubs) {
// 		const objects = pubs;
// 		// console.log(objects);
// 		const sifter = new Sifter(objects);

// 		const result = sifter.search(req.query.string, {
// 			fields: ['slug', 'title'],
// 			sort: [{field: 'title', direction: 'asc'}],
// 			limit: 10
// 		});

// 		const output = [];
// 		_.each(result.items, function(item) {
// 			output.push(objects[item.id]);
// 		});
// 		return res.status(201).json(output);
// 	});
// }
// app.get('/autocompletePubs', autocompletePubs);


// export function autocompletePubsAndUsers(req, res) {
// 	let objects = [];

// 	User.find({}, {'_id': 1, 'username': 1, 'thumbnail': 1, 'name': 1}).lean().exec(function(err, users) {
// 		if (users) {
// 			objects = objects.concat(users);
// 		}

// 		Pub.find({history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}}, {'_id': 0, 'slug': 1, 'title': 1, 'createDate': 1, 'lastUpdated': 1}).exec(function(err2, pubs) {
// 			if (pubs) {
// 				objects = objects.concat(pubs);
// 			}


// 			// console.log(objects)
// 			const sifter = new Sifter(objects);

// 			const result = sifter.search(req.query.string, {
// 				fields: ['username', 'name', 'slug', 'title'],
// 				sort: [{field: 'username', direction: 'asc'}, {field: 'title', direction: 'asc'}],
// 				limit: 10
// 			});

// 			const output = [];
// 			_.each(result.items, function(item) {
// 				output.push(objects[item.id]);
// 			});
// 			return res.status(201).json(output);
// 		});

// 	});
// }
// app.get('/autocompletePubsAndUsers', autocompletePubsAndUsers);

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


export function autocompletePubsAndUsersAndJournals(req, res) {
	let objects = [];

	User.find({}, {'_id': 1, 'username': 1, 'image': 1, 'name': 1}).lean().exec()
	.then(function(users) {
		if (users) {
			objects = objects.concat(users);
		}
		return Atom.find({versions: {$not: {$size: 0}}, isPublished: true}, {'_id': 0, 'slug': 1, 'title': 1, 'createDate': 1, 'lastUpdated': 1}).lean().exec();
	})
	.then(function(atoms) {
		if (atoms) {
			objects = objects.concat(atoms);
		}
		return Journal.find({}, {'_id': 1, 'journalName': 1, 'slug': 1, 'logo': 1}).lean().exec();
	})
	.then(function(journals) {
		if (journals) {
			objects = objects.concat(journals);
		}
		const sifter = new Sifter(objects);
		const result = sifter.search(req.query.string, {
			fields: ['journalName', 'username', 'name', 'slug', 'title'],
			sort: [{field: 'username', direction: 'asc'}, {field: 'title', direction: 'asc'}, {field: 'journalName', direction: 'asc'}],
			limit: 10,
			conjunction: 'and',
		});

		const output = [];
		_.each(result.items, function(item) {
			output.push(objects[item.id]);
		});
		return res.status(201).json(output);
	})
	.catch(function(err) {
		console.log('Error in autocomplete', err);
		return res.status(500).json([]);
	});
}
app.get('/autocompletePubsAndUsersAndJournals', autocompletePubsAndUsersAndJournals);
