const app = require('../api');
const passport = require('passport');

const User = require('../models').User;
const Notification = require('../models').Notification;
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
import {sendResetEmail} from '../services/emails';

export function login(req, res) {
	// Load the app language data and login the user if a login cookie exists
	const loginData = req.user
		? {
			_id: req.user._id,
			name: req.user.name,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			username: req.user.username,
			image: req.user.image,
			settings: req.user.settings,
			following: req.user.following,
			assets: req.user.assets,
			locale: req.user.locale,
			verifiedEmail: req.user.verifiedEmail,
			bio: req.user.bio,
			website: req.user.website,
			github: req.user.github,
			orcid: req.user.orcid,
			twitter: req.user.twitter,
			googleScholar: req.user.googleScholar,
		}
		: {};
	const locale = loginData.locale || 'en';
	
	const tasks = [
		readFile(__dirname + '/../../translations/languages/' + locale + '.json', 'utf8'), // Load the language data
		Notification.find({recipient: loginData._id, read: false}).count().exec() // Query for the notifcation count
	];

	// Run all tasks and return app and login data
	Promise.all(tasks).then(function(results) {
		const languageObject = JSON.parse(results[0]);
		const notificationCount = results[1];

		return res.status(201).json({
			languageData: {
				locale: locale,
				languageObject: languageObject,
			},
			loginData: {
				...loginData,
				notificationCount: notificationCount
			}
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/login', passport.authenticate('local'), login);


// When a user logs out
export function logout(req, res) {
	req.logout();
	res.status(201).json(true);
}
app.get('/logout', logout);

// When a user registers
// export function register(req, res) {
// 	if ((req.body.firstname === 'undefined' && req.body.lastname === 'undefined') || req.body.email.indexOf('@yopmail.com') > -1) { // Spammers inputting 'undefined undefined' are posting lots of pubs
// 		console.log('Blocked register of spam');
// 		return res.status(500).json();
// 	}

// 	User.generateUniqueUsername(req.body.fullname, function(newUsername) {

// 		// Upload to cloudinary so we can have a thumbnail and CDN action.
// 		// cloudinary.uploader.upload(req.body.image, function(cloudinaryResponse) {
// 			// if (!cloudinaryResponse.url) {
// 			// 	console.log('cloudinaryResponse in login-routes did not have url. Here is the response:');
// 			// 	console.log(cloudinaryResponse);
// 			// }
// 		const newUser = new User({
// 			email: req.body.email,
// 			username: newUsername,
// 			image: req.body.image,
// 			thumbnail: req.body.image,
// 			firstName: req.body.firstName,
// 			lastName: req.body.lastName,
// 			name: req.body.fullname,
// 			registerDate: new Date(Date.now()),
// 			sendNotificationDigest: true,
// 		});

// 		User.register(newUser, req.body.password, function(err, account) {
// 			if (err) {
// 				console.log(err);
// 				return res.status(500).json(err);
// 			}

// 			passport.authenticate('local')(req, res, function() {

// 				return res.status(201).json({
// 					firstName: account.firstName,
// 					lastName: account.lastName,
// 					name: account.name,
// 					username: account.username,
// 					image: account.image,
// 					thumbnail: account.thumbnail,
// 					settings: account.settings
// 				});

// 			});

// 		});
// 		// });

// 	});
// }
// app.post('/register', register);

// export function testLogin(req, res) {
// 	// This is used to test if we provide an iFrame with the code to access the login cookie.
// 	// We check to make sure the referring domain is within our set of journals. If it is, we share the login cookie, otherwise we send back an empty page
// 	// Malicious users embedding the same iFrame in evil.com will get an empty response - and no login cookie.
// 	if (req.get('referrer')) {
// 		const referDomain = req.get('referrer').split('://')[1].replace('/', '');
// 		Journal.findOne({ $or: [ {subdomain: referDomain.split('.')[0]}, {customDomain: referDomain}]}, {'_id': 1}).lean().exec(function(err, journal) {
// 			if (journal || referDomain === 'pubpub.media.mit.edu') {
// 				return res.status(201).type('.html').send('<div><script type="text/javascript">var loginCookie = null; try {loginCookie = "connect.sid="+document.cookie.split("connect.sid=")[1].split(";")[0]+";";}catch(err){console.log(err);} parent.postMessage(loginCookie, "' + req.get('referrer') + '");</script></div>');
// 			}
// 			return res.status(201).type('.html').send('');
// 		});
// 	} else {
// 		return res.status(201).type('.html').send('');
// 	}

// }
// app.get('/testLogin', testLogin);

export function requestReset(req, res) {
	User.findOne({email: req.body.email}).exec(function(err, user) {

		if (!user) {
			return res.status(201).json('User Not Found');
		}

		let resetHash = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for ( let index = 0; index < 12; index++) {
			resetHash += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		const expiration = Date.now() + 1000 * 60 * 60 * 24; // Expires in 24 hours.

		User.update({ email: req.body.email }, { resetHash: resetHash, resetHashExpiration: expiration }, function(errUserUpdate, result) {if (errUserUpdate) return console.log(errUserUpdate);});

		// Send reset email
		sendResetEmail(user.email, resetHash, user.username, function(errSendRest, success) {
			if (errSendRest) { console.log(errSendRest); return res.status(500).json(errSendRest); }
			return res.status(201).json(success);
		});

	});

}
app.post('/requestReset', requestReset);

export function checkResetHash(req, res) {
	User.findOne({resetHash: req.body.resetHash, username: req.body.username}).exec(function(err, user) {
		const currentTime = Date.now();
		if (!user || user.resetHashExpiration < currentTime) {
			return res.status(201).json('invalid');
		}

		return res.status(201).json('valid');
	});
}
app.post('/checkResetHash', checkResetHash);

export function passwordReset(req, res) {
	User.findOne({resetHash: req.body.resetHash, username: req.body.username}).exec(function(err, user) {
		const currentTime = Date.now();
		if (!user || user.resetHashExpiration < currentTime) {
			return res.status(201).json('invalid');
		}

		// Update user
		user.setPassword(req.body.password, function() {
			user.resetHash = '';
			user.resetHashExpiration = currentTime;
			user.save();
			return res.status(201).json('success');
		});
	});
}
app.post('/passwordReset', passwordReset);
