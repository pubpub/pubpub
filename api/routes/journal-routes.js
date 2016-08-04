const app = require('../api');
const Journal = require('../models').Journal;
const Link = require('../models').Link;
const Atom = require('../models').Atom;
// const Tag = require('../models').Tag;
const User = require('../models').User;
const mongoose = require('mongoose');

export function createJournal(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }

	const newJournalData = req.body.newJournalData || {};
	const now = new Date().getTime();
	const userID = req.user._id;

	const journal = new Journal({
		journalName: newJournalData.journalName,
		slug: newJournalData.slug.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase(),
		description: newJournalData.description && newJournalData.description.substring(0, 140),
		icon: newJournalData.icon || 'https://assets.pubpub.org/_site/journal.png',
		createDate: now,
	});


	Journal.findOne({slug: newJournalData.slug}).exec()
	.then(function(existingJournal) {
		// If the slug has already been used, return with error
		// else, save the new Journal
		if (existingJournal) {
			throw new Error('Slug Already Exists');
		}
		return journal.save();
	})
	.then(function(newJournal) {
		// Add the creator as an admin to the journal
		const newJournalID = newJournal._id;
		return Link.createLink('admin', userID, newJournalID, userID, now);
	})
	.then(function() {
		// Return the slug of the new Journal
		return res.status(201).json(newJournalData.slug);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createJournal', createJournal);

export function getJournal(req, res) {
	// Determine if admin or not
	// Get journalData
	// Get associated data (e.g. admins, featured, etc)
	// Return
	const {slug, mode} = req.query;
	const userID = req.user ? req.user._id : undefined;

	Journal.findOne({slug: slug}).populate('collections').lean().exec()
	.then(function(journalResult) {
		if (!journalResult) { throw new Error('404 Not Found'); }
		// Get the submitted atoms associated with the journal
		// This query fires if mode is equal to 'submitted'

		const adminLink = Link.findOne({source: userID, destination: journalResult._id, type: 'admin', inactive: {$ne: true} }).exec();
		const findFollowingLink = Link.findOne({source: userID, destination: journalResult._id, type: 'followsJournal', inactive: {$ne: true}}).exec();
		return [journalResult, adminLink, findFollowingLink];
	})
	.spread(function(journalResult, adminLink, followingLink) {
		if (followingLink) {
			journalResult.isFollowing = true;
		}

		const isAdmin = !!adminLink || String(userID) === '568abdd9332c142a0095117f';
		journalResult.isAdmin = isAdmin;

		const getSubmitted = new Promise(function(resolve) {
			if (mode === 'submitted' && isAdmin) {
				const query = Link.find({destination: journalResult._id, type: 'submitted'}).populate({
					path: 'source',
					model: Atom,
					select: 'title slug description previewImage type',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		// Get the featured atoms associated with the journal
		// This query fires if mode is equal to 'featured'
		const getFeatured = new Promise(function(resolve) {
			if (mode === 'featured') {
				const query = Link.find({source: journalResult._id, type: 'featured'}).populate({
					path: 'destination',
					model: Atom,
					select: 'title slug description previewImage type',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		// Get atomsData content
		// The atomsData will vary based on view, e.g. recent activity vs. collection
		const getAtomsData = new Promise(function(resolve) {
			if (mode && mongoose.Types.ObjectId.isValid(mode)) {
				// If there is a mode, it could be a collection, try to grab atoms that are in that collection
				const query = Link.find({source: journalResult._id, type: 'featured', 'metadata.collections': mode}).populate({
					path: 'destination',
					model: Atom,
					select: 'title slug description previewImage type',
				}).exec();
				resolve(query);
			} else {
				// If there is no mode, it is just recent activity, grab them all.
				const query = Link.find({source: journalResult._id, type: 'featured'}).populate({
					path: 'destination',
					model: Atom,
					select: 'title slug description previewImage type',
				}).exec();
				resolve(query);
			}
		});

		// Get the admins data associated with the journal
		// This query fires if mode is equal to 'admins' or 'about'
		const getAdmins = new Promise(function(resolve) {
			if (mode === 'admins' || mode === 'about') {
				const query = Link.find({destination: journalResult._id, type: 'admin', inactive: {$ne: true}}).populate({
					path: 'source',
					model: User,
					select: 'name username bio image',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const tasks = [
			getSubmitted,
			getFeatured,
			getAtomsData,
			getAdmins,
		];

		return [journalResult, Promise.all(tasks)];
	})
	.spread(function(journalResult, taskData) { // Send response
		// What's spread? See here: http://stackoverflow.com/questions/18849312/what-is-the-best-way-to-pass-resolved-promise-values-down-to-a-final-then-chai
		// console.log(taskData[2]);
		return res.status(201).json({
			journalData: journalResult,
			submittedData: taskData[0],
			featuredData: taskData[1],
			atomsData: taskData[2],
			adminsData: taskData[3]
		});
	})
	.catch(function(error) {
		if (error.message === '404 Not Found') {
			console.log(error.message);
			return res.status(404).json('404 Not Found');	
		}
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getJournal', getJournal);

export function updateJournal(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }
	// Check that the user is an admin

	Journal.findOne({slug: req.body.slug}).exec()
	.then(function(journal) {
		// Validate and clean submitted values
		// Take (cleaned) new values if they exist, otherwise set to old value
		const newData = req.body.newJournalData;
		journal.journalName = 'journalName' in newData ? newData.journalName : journal.journalName;
		journal.description = 'description' in newData ? newData.description && newData.description.substring(0, 140) : journal.description;
		journal.about = 'about' in newData ? newData.about : journal.about;
		journal.logo = 'logo' in newData ? newData.logo : journal.logo;
		journal.icon = 'icon' in newData ? newData.icon : journal.icon;
		journal.about = 'about' in newData ? newData.about : journal.about;
		journal.website = 'website' in newData ? newData.website : journal.website;
		journal.twitter = 'twitter' in newData ? newData.twitter : journal.twitter;
		journal.facebook = 'facebook' in newData ? newData.facebook : journal.facebook;
		journal.headerMode = 'headerMode' in newData ? newData.headerMode : journal.headerMode;
		journal.headerAlign = 'headerAlign' in newData ? newData.headerAlign : journal.headerAlign;
		journal.headerColor = 'headerColor' in newData ? newData.headerColor : journal.headerColor;
		journal.headerImage = 'headerImage' in newData ? newData.headerImage : journal.headerImage;
		journal.collections = 'collections' in newData ? newData.collections : journal.collections;
		return journal.save();
	})
	.then(function(savedResult) {
		return Journal.populate(savedResult, {path: 'collections'});
	})
	.then(function(populatedJournal) {
		return res.status(201).json(populatedJournal);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/updateJournal', updateJournal);

export function featureAtom(req, res) {
	const {atomID, journalID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	const inactiveNote = 'featured';
	// Check permission 

	Link.createLink('featured', journalID, atomID, userID, now)
	.then(function() {
		return Link.setLinkInactive('submitted', atomID, journalID, userID, now, inactiveNote);
	})
	.then(function(updatedSubmissionLink) {
		return res.status(201).json(updatedSubmissionLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/featureAtom', featureAtom);

export function rejectAtom(req, res) {
	const {atomID, journalID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	const inactiveNote = 'rejected';
	// Check permission 

	Link.setLinkInactive('submitted', atomID, journalID, userID, now, inactiveNote)
	.then(function(updatedSubmissionLink) {
		return res.status(201).json(updatedSubmissionLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/rejectAtom', rejectAtom);

export function collectionsChange(req, res) {
	const {linkID, collectionIDs} = req.body;
	
	Link.update({_id: linkID, type: 'featured'}, {$set: {'metadata.collections': collectionIDs}})
	.then(function(taskResults) {
		return res.status(201).json('success');	
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/collectionsChange', collectionsChange);

export function addJournalAdmin(req, res) {
	const {adminID, journalID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	// Check permission 

	Link.findOne({source: adminID, destination: journalID, type: 'admin', inactive: {$ne: true}}).exec()
	.then(function(existingLink) {
		if (existingLink) {			
			throw new Error('Admin already exists');
		}
		return Link.createLink('admin', adminID, journalID, userID, now);
	})
	.then(function(newAdminLink) {
		return Link.findOne({source: adminID, destination: journalID, type: 'admin', inactive: {$ne: true}}).populate({
			path: 'source',
			model: User,
			select: 'name username bio image',
		}).exec();
	})
	.then(function(populatedLink) {
		return res.status(201).json(populatedLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/addJournalAdmin', addJournalAdmin);

export function deleteJournalAdmin(req, res) {
	const {adminID, journalID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	// Check permission 

	Link.setLinkInactive('admin', adminID, journalID, userID, now, 'deleted')
	.then(function(deletedLink) {
		return res.status(201).json(deletedLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/deleteJournalAdmin', deleteJournalAdmin);
