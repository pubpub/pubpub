var app = require('../api');
var passport = require('passport');

var Journal = require('../models').Journal;
var Heroku = require('heroku-client');
var heroku = undefined;

if(process.env.NODE_ENV !== 'production'){
	import {herokuApiKey} from '../authentication/herokuCredentials';	
	console.log('herokuApiKey', herokuApiKey);
	heroku = new Heroku({ token: herokuApiKey });
}else{
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
}

app.get('/testheroku', function(req,res){

	heroku.post('/apps/immense-escarpment-3653/domains', { hostname: 'funky.pbpb.co' }, function (err, app) {
		if (err) {console.log(err);}
		heroku.apps('immense-escarpment-3653').domains().list(function (err, apps) {
		  return res.status(201).json(apps);
		});
	});
	// heroku.delete('/apps/immense-escarpment-3653/domains/funky.pbpb.co', function (err, app) {
	// 	heroku.apps('immense-escarpment-3653').domains().list(function (err, apps) {
	// 	  return res.status(201).json(apps);
	// 	});
	// });

});

app.post('/createJournal', function(req,res){
	const journal = new Journal({
		journalName: req.body.journalName,
		subdomain: req.body.subdomain,
		createDate: new Date().getTime(),
		admins: [req.user._id],
	});

	journal.save(function (err, savedJournal) {
		if (err) { return res.status(500).json(err);  }

		return res.status(201).json(savedJournal.subdomain);	
		
	});
});

app.get('/journalLoad', function(req,res){
	// Load journal Data
	// When an implicit login request is made using the cookie
	// Journal.findOne({ $or:[ {'subdomain':req.query.host.split('.')[0]}, {'customDomain':req.query.host}]}).lean().exec(function(err, result){
	Journal.find(req.body.host)

		if(req.user){

			return res.status(201).json({
				name: req.user.name,
				username: req.user.username,
				image: req.user.image,
				thumbnail: req.user.thumbnail,
				settings: req.user.settings
			});

		}else{
			return res.status(201).json('No Session');
		}

	return res.status(201).json(thing)

});