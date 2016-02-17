var app = require('../api');
var passport = require('passport');

var Pub = require('../models').Pub;
var User = require('../models').User;
var Journal = require('../models').Journal;
var Notification = require('../models').Notification;
import {cloudinary} from '../services/cloudinary';
import {sendResetEmail} from '../services/emails';

// When an implicit login request is made using the cookie
app.get('/login', function(req,res){
	if(req.user){

		return res.status(201).json({
			name: req.user.name,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			username: req.user.username,
			image: req.user.image,
			thumbnail: req.user.thumbnail,
			settings: req.user.settings,
			following: req.user.following,
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

			Notification.getUnreadCount(user._id, function(err, notificationCount) {

				return res.status(201).json({
					name: user.name,
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
					image: user.image,
					thumbnail: user.thumbnail,
					settings: user.settings,
					following: req.user.following,
					isAdminToJournal: isAdmin,
					notificationCount: notificationCount,
				});

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
	// console.log(req.body);
	User.generateUniqueUsername(req.body.fullname, function(newUsername){
		
		// Upload to cloudinary so we can have a thumbnail and CDN action.
		cloudinary.uploader.upload(req.body.image, function(cloudinaryResponse) { 
			if (!cloudinaryResponse.url) {
				console.log('cloudinaryResponse in login-routes did not have url. Here is the response:');
				console.log(cloudinaryResponse);
			}
			const newUser = new User({ 
				email : req.body.email, 
				username: newUsername, 
				image: req.body.image, 
				thumbnail: cloudinaryResponse.url ? cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50') : req.body.image,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				name: req.body.fullname, 
				registerDate: new Date(Date.now()),
				sendNotificationDigest: true,
			});

			User.register(newUser, req.body.password, function(err, account) {
				if (err){
					console.log(err);
					return res.status(500).json(err);
				}

				passport.authenticate('local')(req,res,function(){
					
					return res.status(201).json({
						firstName: account.firstName,
						lastName: account.lastName,
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

app.get('/testLogin', function(req,res){
	// This is used to test if we provide an iFrame with the code to access the login cookie.
	// We check to make sure the referring domain is within our set of journals. If it is, we share the login cookie, otherwise we send back an empty page
	// Malicious users embedding the same iFrame in evil.com will get an empty response - and no login cookie.
	if (req.get('referrer')) {
		const referDomain = req.get('referrer').split('://')[1].replace('/','');
		Journal.findOne({ $or:[ {'subdomain':referDomain.split('.')[0]}, {'customDomain':referDomain}]}, {'_id':1}).lean().exec(function(err, journal){
			if (journal || referDomain === 'pubpub.media.mit.edu') {
				return res.status(201).type('.html').send('<div><script type="text/javascript">var loginCookie = null; try {loginCookie = "connect.sid="+document.cookie.split("connect.sid=")[1].split(";")[0]+";";}catch(err){console.log(err);} parent.postMessage(loginCookie, "' + req.get('referrer') + '");</script></div>');		
			}
			return res.status(201).type('.html').send('');
	 	});
	} else {
		return res.status(201).type('.html').send('');
	}
	
});

app.post('/requestReset', function(req, res) {
	
	User.findOne({'email':req.body.email}).exec(function (err, user) {
		
		if(!user){
		  return res.status(201).json('User Not Found');
		}

		var resetHash = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 12; i++ ) {
			resetHash += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		var expiration = Date.now() + 1000*60*60*24; //Expires in 24 hours.

		User.update({ email: req.body.email }, { 'resetHash':resetHash, 'resetHashExpiration': expiration }, function(err, result){if(err) return handleError(err)});

		// Send reset email
		sendResetEmail(user.email, resetHash, user.username, function(err, success){
			if (err){ console.log(err); return res.status(500).json(err); }
			return res.status(201).json(success);
		});
		
	});

});

app.post('/checkResetHash', function(req, res) {
	
	User.findOne({'resetHash':req.body.resetHash, 'username':req.body.username}).exec(function (err, user) {
		const currentTime = Date.now();
		if (!user || user.resetHashExpiration < currentTime) {
			return res.status(201).json('invalid');
		}

		return res.status(201).json('valid');
	});
});	

app.post('/passwordReset', function(req, res) {
	
	User.findOne({'resetHash':req.body.resetHash, 'username':req.body.username}).exec(function (err, user) {
		const currentTime = Date.now();
		if (!user || user.resetHashExpiration < currentTime) {
			return res.status(201).json('invalid');
		}

		// Update user
		user.setPassword(req.body.password, function(){
			user.resetHash = '';
			user.resetHashExpiration = currentTime;
			user.save();
			return res.status(201).json('success');      
		});			
	});

});	




