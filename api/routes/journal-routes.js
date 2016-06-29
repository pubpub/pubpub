const app = require('../api');
const _ = require('underscore');
const Journal = require('../models').Journal;
const User = require('../models').User;
const Pub = require('../models').Pub;
// import {cloudinary} from '../services/cloudinary';
const Firebase = require('firebase');
import {fireBaseURL, generateAuthToken} from '../services/firebase';
import {featurePub} from '../services/recommendations';

export function createJournal(req, res) {
	if (!req.user) {
		return res.status(500).json('Not logged in');
	}

	Journal.isUnique(req.body.subdomain, (err, result)=>{
		if (!result) { return res.status(500).json('Subdomain is not Unique!'); }

		const journal = new Journal({
			journalName: req.body.journalName,
			subdomain: req.body.subdomain,
			createDate: new Date().getTime(),
			admins: [req.user._id],
			collections: [],
			pubsFeatured: [],
			pubsSubmitted: [],
			design: {
				headerBackground: '#373737',
				headerText: '#E0E0E0',
				headerHover: '#FFF',
				landingHeaderBackground: '#FFF',
				landingHeaderText: '#373737',
				landingHeaderHover: '#000',
			},
		});

		journal.save(function(errSavingJournal, savedJournal) {
			if (err) { return res.status(500).json(err); }
			User.update({ _id: req.user._id }, { $addToSet: { adminJournals: savedJournal._id} }, function(adminAddErr, addAdminResult) {if (adminAddErr) return res.status(500).json('Failed to add as admin'); });

			const journalLandingSlug = savedJournal.subdomain + '-landingpage'; // Guaranteed unique because we don't allow pubs to be created ending with 'landingpage' and subdomain is unique
			const journalLandingTitle = savedJournal.journalName;
			Pub.createPub(journalLandingSlug, journalLandingTitle, savedJournal._id, true, function(createErr, savedPub) {

				const ref = new Firebase(fireBaseURL + journalLandingSlug + '/editorData' );
				ref.authWithCustomToken(generateAuthToken(), ()=>{
					const newEditorData = {
						collaborators: {},
						settings: {styleDesktop: ''},
					};
					newEditorData.collaborators[savedJournal.subdomain] = {
						_id: savedJournal._id.toString(),
						name: savedJournal.journalName + ' Admins',
						firstName: savedJournal.journalName || '',
						lastName: 'Admins',
						thumbnail: '/thumbnails/group.png',
						permission: 'edit',
						admin: true,
					};
					ref.set(newEditorData);

					savedJournal.landingPage = savedPub._id;
					savedJournal.save(function(errSavingLanding, savedJournalWithPub) {
						return res.status(201).json(savedJournalWithPub.subdomain);
					});

				});
			});


		});
	});
}
app.post('/createJournal', createJournal);

export function getJournal(req, res) {
	Journal.findOne({subdomain: req.query.subdomain})
	.populate(Journal.populationObject())
	.lean().exec(function(err, result) {
		if (err) { return res.status(500).json(err); }

		let isAdmin = false;
		const userID = req.user ? req.user._id : undefined;
		const adminsLength = result ? result.admins.length : 0;
		for (let index = adminsLength; index--; ) {
			if (String(result.admins[index]._id) === String(userID)) {
				isAdmin = true;
			}
		}

		return res.status(201).json({
			...result,
			isAdmin: isAdmin,
		});
	});
}
app.get('/getJournal', getJournal);

export function saveJournal(req, res) {
	Journal.findOne({subdomain: req.body.subdomain}).exec(function(err, journal) {
		// console.log('in server save journal');
		// console.log('req.body', req.body);
		// console.log('journal', journal);

		if (err) { return res.status(500).json(err); }

		if (!req.user || String(journal.admins).indexOf(String(req.user._id)) === -1) {
			return res.status(403).json('Not authorized to administrate this Journal.');
		}

		if ('customDomain' in req.body.newObject && req.body.newObject.customDomain !== journal.customDomain) {
			// console.log('we got a new custom domain!');
			Journal.updateHerokuDomains(journal.customDomain, req.body.newObject.customDomain);

		}

		if ('pubsFeatured' in req.body.newObject) {
			// If there are new pubs to be featured, we have to update the pub with a new feature entry
			// We don't have to update any submit entries, as you can't do that from the journal curate page
			const newFeatured = req.body.newObject.pubsFeatured;
			const oldFeatured = journal.pubsFeatured.map((pubID)=>{return String(pubID);});
			const pubsToUpdateFeature = _.difference(newFeatured, oldFeatured);
			for (let index = pubsToUpdateFeature.length; index--;) {
				Pub.addJournalFeatured(pubsToUpdateFeature[index], journal._id, req.user._id);
				featurePub(journal._id, pubsToUpdateFeature[index], null);
			}
		}

		if ('admins' in req.body.newObject) {
			// If there are admins to be updated, we need to appropriately add this journal's _id
			// to the user's profile, and remove for removed admins
			const newAdminStrings = req.body.newObject.admins.length ? req.body.newObject.admins.toString().split(',') : [];
			const oldAdminStrings = journal.admins.length ? journal.admins.toString().split(',') : [];

			journal.admins.map((adminID)=>{
				// If it was in the old, but is not in the new, pull it
				if (newAdminStrings.indexOf(adminID.toString()) === -1) {
					User.update({ _id: adminID }, { $pull: { adminJournals: journal._id} }, function(adminAddErr, addAdminResult) {if (adminAddErr) return res.status(500).json('Failed to add as admin'); });
				}
			});

			req.body.newObject.admins.map((adminID)=>{
				// If it is in the new, but was not in the old, add it
				if (oldAdminStrings.indexOf(adminID.toString()) === -1) {
					User.update({ _id: adminID }, { $addToSet: { adminJournals: journal._id} }, function(adminAddErr, addAdminResult) {if (adminAddErr) return res.status(500).json('Failed to add as admin'); });
				}
			});

		}

		for (const key in req.body.newObject) {
			if (req.body.newObject.hasOwnProperty(key)) {
				journal[key] = req.body.newObject[key];
			}
		}

		journal.save(function(errSave, result) {
			if (errSave) { return res.status(500).json(errSave); }

			Journal.populate(result, Journal.populationObject(), function(errPopulate, populatedJournal) {
				return res.status(201).json({
					...populatedJournal.toObject(),
					isAdmin: true,
				});
			});


		});
	});
}
app.post('/saveJournal', saveJournal);

export function submitPubToJournal(req, res) {
	Journal.findOne({_id: req.body.journalID}).exec(function(err, journal) {
		if (err) { return res.status(500).json(err); }

		if (!journal) { return res.status(500).json(err); }

		if ( !req.user ) {
			return res.status(403).json('Not authorized to administrate this Journal.');
		}

		if (String(journal.pubsSubmitted).indexOf(req.body.pubID) === -1 && String(journal.pubsFeatured).indexOf(req.body.pubID) === -1) {

			Pub.addJournalSubmitted(req.body.pubID, req.body.journalID, req.user._id);

			if (journal.autoFeature) {
				journal.pubsFeatured.push(req.body.pubID);
				Pub.addJournalFeatured(req.body.pubID, req.body.journalID, null);
			} else {
				journal.pubsSubmitted.push(req.body.pubID);
			}


		}

		journal.save(function(errSave, result) {
			if (errSave) { return res.status(500).json(errSave); }

			Journal.populate(result, Journal.populationObject(), function(errPopulate, populatedJournal) {
				return res.status(201).json({
					...populatedJournal.toObject(),
					isAdmin: true,
				});
			});


		});
	});
}
app.post('/submitPubToJournal', submitPubToJournal);

export function createCollection(req, res) {
	// return res.status(201).json(['cat','dog']);
	Journal.findOne({subdomain: req.body.subdomain}).exec(function(err, journal) {
		const defaultHeaderImages = [
			'https://res.cloudinary.com/pubpub/image/upload/v1451320792/coll4_ivgyzj.jpg',
			'https://res.cloudinary.com/pubpub/image/upload/v1451320792/coll5_nwapxj.jpg',
			'https://res.cloudinary.com/pubpub/image/upload/v1451320792/coll6_kqgzbq.jpg',
			'https://res.cloudinary.com/pubpub/image/upload/v1451320792/coll7_mrq4q9.jpg',
		];

		const newCollection = {
			title: req.body.newCollectionObject.title,
			slug: req.body.newCollectionObject.slug,
			description: '',
			pubs: [],
			headerImage: defaultHeaderImages[Math.floor(Math.random() * defaultHeaderImages.length)],
		};
		journal.collections.push(newCollection);

		journal.save(function(errSave, savedJournal) {
			if (errSave) { return res.status(500).json(errSave); }

			Journal.populate(savedJournal, Journal.populationObject(true), function(errPopulate, populatedJournal) {
				if (errPopulate) { return res.status(500).json(errPopulate); }

				return res.status(201).json(populatedJournal.collections);
			});

		});
	});
}
app.post('/createCollection', createCollection);

export function saveCollection(req, res) {
	Journal.findOne({subdomain: req.body.subdomain}).exec(function(err, journal) {
		const collections = journal ? journal.collections : [];

		function updateAndSave(cloudinaryURL) {
			for (let index = collections.length; index--;) {
				if (collections[index].slug === req.body.slug) {
					if (cloudinaryURL) {
						journal.collections[index].headerImage = cloudinaryURL;
					}
					for (const key in req.body.newCollectionObject) {
						if (req.body.newCollectionObject.hasOwnProperty(key)) {
							journal.collections[index][key] = req.body.newCollectionObject[key];
						}
					}
					break;
				}
			}
			journal.save(function(errJournalSave, savedJournal) {
				if (errJournalSave) { return res.status(500).json(errJournalSave); }

				Journal.populate(savedJournal, Journal.populationObject(true), function(errJournPopulate, populatedJournal) {
					if (errJournPopulate) { return res.status(500).json(errJournPopulate); }

					return res.status(201).json(populatedJournal.collections);
				});

			});
		}

		if (req.body.newCollectionObject.headerImageURL) {
			// cloudinary.uploader.upload(req.body.newCollectionObject.headerImageURL, function(cloudinaryResponse) {
				// const cloudinaryURL = cloudinaryResponse.url;
			updateAndSave(req.body.newCollectionObject.headerImageURL);

			// });
		} else {
			updateAndSave();
		}

	});
}
app.post('/saveCollection', saveCollection);

export function getJournalPubs(req, res) {
	const host = req.headers.host.split(':')[0];
	Journal.findOne({ $or: [ {subdomain: host.split('.')[0]}, {customDomain: host}]})
	.populate(Journal.populationObject(false, true))
	.lean().exec(function(err, journal) {
		if (err) {console.log(err); return res.status(500).json(err);}
		if (!journal) {return res.status(201).json([]);}
		return res.status(201).json(journal.pubsFeatured);
	});
}
app.get('/getJournalPubs', getJournalPubs);

export function getJournalCollections(req, res) {
	const host = req.headers.host.split(':')[0];
	Journal.findOne({ $or: [ {subdomain: host.split('.')[0]}, {customDomain: host}]})
	.populate(Journal.populationObject(true, false))
	.lean().exec(function(err, journal) {
		if (err || !journal) {
			console.log(err);
			return res.status(201).json();
		}
		return res.status(201).json(journal.collections);
	});
}
app.get('/getJournalCollections', getJournalCollections);
