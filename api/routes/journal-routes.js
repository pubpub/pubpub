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

app.get('/getJournal', function(req,res){
	Journal.findOne({subdomain: req.query.subdomain}).lean().exec(function(err, result) {
		if (err) { return res.status(500).json(err);  }

		let isAdmin = false;
		const userID = req.user ? req.user._id : undefined;
		if (result && String(result.admins).indexOf(userID) !== -1) {
			isAdmin =  true;
		}

		return res.status(201).json({
			...result,
			isAdmin: isAdmin,
		});
	});
});

app.post('/saveJournal', function(req,res){
	Journal.findOne({subdomain: req.body.subdomain}).exec(function(err, journal) {
		// console.log('in server save journal');
		// console.log('req.body', req.body);
		// console.log('journal', journal);

		if (err) { return res.status(500).json(err);  }

		if (!req.user || String(journal.admins).indexOf(req.user._id) === -1) {
			return res.status(403).json('Not authorized to administrate this Journal.');
		}

		journal[req.body.key] = req.body.newObject;

		journal.save(function(err, result){
			if (err) { return res.status(500).json(err);  }
			
			return res.status(201).json({
				...journal.toObject(),
				isAdmin: true,
			});	
			
		});
	});
});

app.get('/loadJournalAndLogin', function(req,res){
	// Load journal Data
	// When an implicit login request is made using the cookie
	Journal.findOne({ $or:[ {'subdomain':req.query.host.split('.')[0]}, {'customDomain':req.query.host}]}).lean().exec(function(err, result){
		// console.log('journalResult', result);
		let isAdmin = false;
		const userID = req.user ? req.user._id : undefined;
		if (result && String(result.admins).indexOf(userID) !== -1) {
			isAdmin =  true;
		}
		if(req.user){
			return res.status(201).json({
				journalData: {
					...result,
					isAdmin: isAdmin,
				},
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
				journalData: {
					...result,
					isAdmin: false,
				},
				loginData: 'No Session',
			});
		}
	});


});