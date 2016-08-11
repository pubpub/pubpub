const app = require('../api');
const passport = require('passport');

const User = require('../models').User;
const Notification = require('../models').Notification;
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
import {sendVerificationEmail} from '../services/emails';

// When a user signs up
export function signup(req, res) {
	const fullName = req.body.firstName + ' ' + req.body.lastName;
	User.generateUniqueUsername(fullName, function(newUsername) {

		let verificationHash = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for ( let index = 0; index < 12; index++) {
			verificationHash += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		const newUser = new User({
			email: req.body.email,
			username: newUsername,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			name: fullName,
			registerDate: new Date(Date.now()),
			sendNotificationDigest: true,
<<<<<<< Updated upstream
			image: 'https://assets.pubpub.org/_site/happyPub.png',
=======
			image: 'https://assets.pubpub.org/happyPub.png',
>>>>>>> Stashed changes
			verificationHash: verificationHash,
			verifiedEmail: false,
		});

		User.register(newUser, req.body.password, function(err, account) {
			if (err) { console.log(err); return res.status(500).json('emailAlreadyUsed'); }

			sendVerificationEmail(newUser.email, verificationHash, function(errSendRest, success) {
				if (errSendRest) { console.log(errSendRest); }
			});

			passport.authenticate('local')(req, res, function() {

				const loginData = {
					firstName: account.firstName,
					lastName: account.lastName,
					name: account.name,
					username: account.username,
					image: account.image,
					settings: account.settings,
					verifiedEmail: account.verifiedEmail
				};
				const locale = 'en';

				const tasks = [
					readFile(__dirname + '/../../translations/languages/' + locale + '.json', 'utf8'), // Load the language data
					Notification.find({recipient: loginData._id, read: false}).count().exec() // Query for the notifcation count
				];

				// Run all tasks and return app and login data
				Promise.all(tasks).then(function(results) {
					const languageObject = results[0];
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

			});

		});

	});
}
app.post('/signup', signup);


export function signupDetails(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID).exec()
	.then(function(result) {
<<<<<<< Updated upstream
		result.image = req.body.image;
		result.bio = req.body.bio && req.body.bio.substring(0, 140);
		result.website = req.body.website;
		result.twitter = req.body.twitter;
		result.publicEmail = req.body.publicEmail;
		result.orcid = req.body.orcid;
		result.github = req.body.github;
		result.googleScholar = req.body.googleScholar;
=======
		result.image = req.body.image || result.image;
		result.bio = req.body.bio && req.body.bio.substring(0, 140) || result.bio;
		result.website = req.body.website || result.website;
		result.twitter = req.body.twitter || result.twitter;
		result.orcid = req.body.orcid || result.orcid;
		result.github = req.body.github || result.github;
		result.googleScholar = req.body.googleScholar || result.googleScholar;
>>>>>>> Stashed changes
		return result.save();
	})
	.then(function(savedResult) {
		return res.status(201).json({
			image: savedResult.image,
			bio: savedResult.bio,
			website: savedResult.website,
			twitter: savedResult.twitter,
<<<<<<< Updated upstream
			publicEmail: savedResult.publicEmail,
=======
>>>>>>> Stashed changes
			orcid: savedResult.orcid,
			github: savedResult.github,
			googleScholar: savedResult.googleScholar,
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/signup-details', signupDetails);
<<<<<<< Updated upstream

export function resendVerificationEmail(req, res) {
	const user = req.user || undefined;
	if (!user) { return res.status(403).json('Not authorized to edit this user'); }

	
	sendVerificationEmail(user.email, user.verificationHash, function(errSendRest, success) {
		if (errSendRest) { console.log(errSendRest); }
		return res.status(201).json('Verification Email Resent');
	});
}
app.post('/resendVerificationEmail', resendVerificationEmail);
=======
>>>>>>> Stashed changes
