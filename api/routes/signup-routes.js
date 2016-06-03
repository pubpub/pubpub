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
			image: 'https://assets.pubpub.org/happyPub.png',
			thumbnail: 'https://jake.pubpub.org/unsafe/50x50/https://assets.pubpub.org/happyPub.png',
			verificationHash: verificationHash,
			verifiedEmail: false,
		});

		User.register(newUser, req.body.password, function(err, account) {
			if (err) { console.log(err); return res.status(500).json('Email already used'); }

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
					thumbnail: account.thumbnail,
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
