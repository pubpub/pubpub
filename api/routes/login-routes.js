var app = require('../api');
var passport = require('passport');

var Pub = require('../models').Pub;
var User = require('../models').User;
var Journal = require('../models').Journal;
import {cloudinary} from '../services/cloudinary';


// When an implicit login request is made using the cookie
app.get('/login', function(req,res){
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

});

// When an explicit login request is made
app.post('/login', passport.authenticate('local'), function(req, res) {
	User.findOne({'email':req.body.email}).exec(function (err, user) {
		if (err){
			console.log(err);
			return res.status(500).json(err);
		}
		
		Journal.findOne({ $or:[ {'subdomain':req.query.host.split('.')[0]}, {'customDomain':req.query.host}]}).lean().exec(function(err, journal){

			const userID = user._id;
			const isAdmin = journal && String(journal.admins).indexOf(String(userID)) > -1 ? true : false;

			return res.status(201).json({
				name: user.name,
				username: user.username,
				image: user.image,
				thumbnail: user.thumbnail,
				settings: user.settings,
				isAdminToJournal: isAdmin,
			});

		});
		
	});
});

// When a user logs out
app.get('/logout', function(req, res) {
	req.logout();
	res.status(201).json(true);
});

// When a user registers
app.post('/register', function(req, res) {
	// console.log(req.body.host);
	User.generateUniqueUsername(req.body.fullname, function(newUsername){
		
		// Upload to cloudinary so we can have a thumbnail and CDN action.
		cloudinary.uploader.upload(req.body.image, function(cloudinaryResponse) { 
			const newUser = new User({ 
				email : req.body.email, 
				username: newUsername, 
				image: req.body.image, 
				thumbnail: cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50'),
				name: req.body.fullname, 
				registerDate: new Date(Date.now()),
			});

			User.register(newUser, req.body.password, function(err, account) {
				if (err){
					console.log(err);
					return res.status(500).json(err);
				}

				passport.authenticate('local')(req,res,function(){
					
					return res.status(201).json({
						name: account.name,
						username: account.username,
						image: account.image,
						thumbnail: account.thumbnail,
						settings: account.settings
					});

				});

			});
		});
		
	});

});


// import {sendgridUsername, sendgridPassword} from '../authentication/sendgridCredentials';
// var sendgrid  = require('sendgrid')(sendgridUsername, sendgridPassword);

// Send Email Confirmation
// var email     = new sendgrid.Email({
//   to:       user.email,
//   from:     'pubpub@media.mit.edu',
//   fromname: 'PubPub Team',
//   subject:  'Welcome to PubPub!',
//   text:     'You Successfully Registered!'
// });
// sendgrid.send(email, function(err, json) {
//   if (err) { return console.error(err); }
//   console.log(json);
// });

// End Send Email Confirmation
