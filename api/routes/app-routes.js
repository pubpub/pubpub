const app = require('../api');
const Notification = require('../models').Notification;
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);

export function loadAppAndLogin(req, res) {
	// Load the app language data and login the user if a login cookie exists
	const loginData = req.user
		? {
			_id: req.user._id,
			name: req.user.name,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			username: req.user.username,
			image: req.user.image,
			thumbnail: req.user.thumbnail,
			settings: req.user.settings,
			following: req.user.following,
			assets: req.user.assets,
			locale: req.user.locale,
		}
		: {};
	const locale = loginData.locale || 'en';
	
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

}
app.get('/loadAppAndLogin', loadAppAndLogin);

// export function getRandomSlug(req, res) {
// 	Pub.getRandomSlug(req.query.journalID, function(err, result) {
// 		if (err) {console.log(err); return res.json(500);}
// 		return res.status(201).json(result);
// 	});
// }
// app.get('/getRandomSlug', getRandomSlug);
