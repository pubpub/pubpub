var app = require('../api');
var passport = require('passport');

var Journal = require('../models').Journal;
var User = require('../models').User;
var Heroku = require('heroku-client');
var heroku = undefined;

if(process.env.NODE_ENV !== 'production'){
	import {herokuApiKey} from '../authentication/herokuCredentials';	
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
		User.update({ _id: req.user._id }, { $addToSet: { adminJournals: savedJournal._id} }, function(err, result){if(err) return handleError(err)});

		return res.status(201).json(savedJournal.subdomain);	

	});
});

app.get('/loadJournalAndLogin', function(req,res){
	// Load journal Data
	// When an implicit login request is made using the cookie
	Journal.findOne({ $or:[ {'subdomain':req.query.host.split('.')[0]}, {'customDomain':req.query.host}]}).lean().exec(function(err, result){
	// Journal.find(req.body.host)
		console.log('journalResult', result);

		if(req.user){

			return res.status(201).json({
				journalData: result,
				loginData: {
					name: req.user.name,
					username: req.user.username,
					image: req.user.image,
					thumbnail: req.user.thumbnail,
					settings: req.user.settings
				},
			});

		}else{
			return res.status(201).json({
				journalData: result,
				loginData: 'No Session',
			});
		}
	});


});