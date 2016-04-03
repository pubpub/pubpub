const app = require('../api');
const fs = require('fs');
const Journal = require('../models').Journal;
const Pub = require('../models').Pub;
const Asset = require('../models').Asset;
const Notification = require('../models').Notification;

export function loadAppAndLogin(req, res) {
	// Load app Data
	// When an implicit login request is made using the cookie
	// console.time("dbsave");
	Journal.findOne({ $or: [ {subdomain: req.query.host.split('.')[0]}, {customDomain: req.query.host}]})
	.populate(Journal.populationObject())
	.lean().exec(function(err, result) {
		// console.timeEnd("dbsave");
		const journalID = result ? result._id : null;
		Pub.getRandomSlug(journalID, function(errPubSlug, randomSlug) {
			// const locale = result && result.locale ? result.locale : 'en';
			const locale = result && result.locale ? result.locale : 'en';
			let languageObject = {};
			fs.readFile(__dirname + '/../../translations/languages/' + locale + '.json', 'utf8', function(errFSRead, data) {
				if (err) { console.log(err); }
				const customMessages = JSON.parse(result ? result.customLanguageMessages || '{}' : '{}');
				languageObject = {...JSON.parse(data), ...customMessages};

				const userID = req.user ? req.user._id : undefined;
				Notification.getUnreadCount(userID, function(errNotificationUnread, notificationCount) {
					const loginData = req.user
						? {
							name: req.user.name,
							firstName: req.user.firstName,
							lastName: req.user.lastName,
							username: req.user.username,
							image: req.user.image,
							thumbnail: req.user.thumbnail,
							settings: req.user.settings,
							following: req.user.following,
							notificationCount: notificationCount,
							assets: req.user.assets,
						}
						: 'No Session';

					Asset.find({_id: { $in: loginData.assets } }, function(errAssetFind, assets) {
						if (assets.length) {
							loginData.assets = assets;
						}

						if (result) {
							// If it is a journal, check if the user is an admin.
							let isAdmin = false;
							const resultUserID = req.user ? req.user._id : undefined;
							const adminsLength = result ? result.admins.length : 0;
							for (let index = adminsLength; index--; ) {
								if (String(result.admins[index]._id) === String(resultUserID)) {
									isAdmin = true;
								}
							}

							return res.status(201).json({
								journalData: {
									...result,
									isAdmin: isAdmin,
									randomSlug: randomSlug,
								},
								languageData: {
									locale: locale,
									languageObject: languageObject,
								},
								loginData: loginData,
							});

						}
						// If there was no result, that means we're on pubpub.org, and we need to populate journals and pubs.
						Journal.find({}, {_id: 1, journalName: 1, subdomain: 1, customDomain: 1, pubsFeatured: 1, collections: 1, design: 1}).lean().exec(function(errJournalFind, journals) {
							Pub.find({history: {$not: {$size: 0}}, 'settings.isPrivate': {$ne: true}}, {_id: 1, title: 1, slug: 1, abstract: 1}).lean().exec(function(errPubFind, pubs) {
								// console.log(res);
								return res.status(201).json({
									journalData: {
										...result,
										allJournals: journals,
										allPubs: pubs,
										isAdmin: false,
										// locale: locale,
										// languageObject: languageObject,
										randomSlug: randomSlug,
									},
									languageData: {
										locale: locale,
										languageObject: languageObject,
									},
									loginData: loginData,
								});

							});
						});
					});

				});

			});
		});
	});
}
app.get('/loadAppAndLogin', loadAppAndLogin);

export function getRandomSlug(req, res) {
	Pub.getRandomSlug(req.query.journalID, function(err, result) {
		if (err) {console.log(err); return res.json(500);}
		return res.status(201).json(result);
	});
}
app.get('/getRandomSlug', getRandomSlug);
