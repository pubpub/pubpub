const app = require('../api');
const Jrnl = require('../models').Jrnl;
const Link = require('../models').Link;
const Atom = require('../models').Atom;

export function createJrnl(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }

	const newJrnlData = req.body.newJrnlData || {};
	const now = new Date().getTime();
	const userID = req.user._id;

	const jrnl = new Jrnl({
		jrnlName: newJrnlData.jrnlName,
		slug: newJrnlData.slug.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase(),
		description: newJrnlData.description && newJrnlData.description.substring(0, 140),
		icon: newJrnlData.icon || 'https://assets.pubpub.org/_site/journal.png',
		createDate: now,
	});


	Jrnl.findOne({slug: newJrnlData.slug}).exec()
	.then(function(existingJournal) {
		// If the slug has already been used, return with error
		// else, save the new Jrnl
		if (existingJournal) {
			throw new Error('Slug Already Exists');
		}
		return jrnl.save();
	})
	.then(function(newJrnl) {
		// Add the creator as an admin to the journal
		const newJrnlID = newJrnl._id;
		return Link.createLink('admin', userID, newJrnlID, userID, now);
	})
	.then(function() {
		// Return the slug of the new Jrnl
		return res.status(201).json(newJrnlData.slug);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createJrnl', createJrnl);

export function getJrnl(req, res) {
	// Determine if admin or not
	// Get jrnlData
	// Get associated data (e.g. admins, featured, etc)
	// Return
	const {slug, mode} = req.query;

	Jrnl.findOne({slug: slug}).populate('collections').lean().exec()
	.then(function(jrnlResult) {

		// Get the submitted atoms associated with the journal
		// This query fires if mode is equal to 'submitted'
		const getSubmitted = new Promise(function(resolve) {
			if (mode === 'submitted') {
				const query = Link.find({destination: jrnlResult._id, type: 'submitted'}).populate({
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
				const query = Link.find({source: jrnlResult._id, type: 'featured'}).populate({
					path: 'destination',
					model: Atom,
					select: 'title slug description previewImage type',
				}).exec();
				resolve(query);
			} else {
				resolve();
			}
		});

		const tasks = [
			getSubmitted,
			getFeatured,
		];

		return [jrnlResult, Promise.all(tasks)];
	})
	.spread(function(jrnlResult, taskData) { // Send response
		// What's spread? See here: http://stackoverflow.com/questions/18849312/what-is-the-best-way-to-pass-resolved-promise-values-down-to-a-final-then-chai
		return res.status(201).json({
			jrnlData: jrnlResult,
			submittedData: taskData[0],
			featuredData: taskData[1],
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getJrnl', getJrnl);

export function updateJrnl(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }
	// Check that the user is an admin

	Jrnl.findOne({slug: req.body.slug}).exec()
	.then(function(jrnl) {
		// Validate and clean submitted values
		// Take (cleaned) new values if they exist, otherwise set to old value
		const newData = req.body.newJrnlData;
		jrnl.jrnlName = newData.jrnlName || jrnl.jrnlName;
		jrnl.description = newData.description && newData.description.substring(0, 140) || jrnl.description;
		jrnl.about = newData.about || jrnl.about;
		jrnl.logo = newData.logo || jrnl.logo;
		jrnl.icon = newData.icon || jrnl.icon;
		jrnl.about = newData.about || jrnl.about;
		jrnl.website = newData.website || jrnl.website;
		jrnl.twitter = newData.twitter || jrnl.twitter;
		jrnl.facebook = newData.facebook || jrnl.facebook;
		jrnl.headerMode = newData.headerMode || jrnl.headerMode;
		jrnl.headerAlign = newData.headerAlign || jrnl.headerAlign;
		jrnl.headerColor = newData.headerColor || jrnl.headerColor;
		jrnl.headerImage = newData.headerImage || jrnl.headerImage;
		jrnl.collections = newData.collections || jrnl.collections;
		return jrnl.save();
	})
	.then(function(savedResult) {
		return Jrnl.populate(savedResult, {path: 'collections'});
	})
	.then(function(populatedJrnl) {
		return res.status(201).json(populatedJrnl);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/updateJrnl', updateJrnl);

export function featureAtom(req, res) {
	const {atomID, jrnlID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	const inactiveNote = 'featured';
	// Check permission 

	Link.createLink('featured', jrnlID, atomID, userID, now)
	.then(function() {
		return Link.setLinkInactive('submitted', atomID, jrnlID, userID, now, inactiveNote);
	})
	.then(function(updatedSubmissionLink) {
		console.log(updatedSubmissionLink);
		return res.status(201).json(updatedSubmissionLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/featureAtom', featureAtom);

export function rejectAtom(req, res) {
	const {atomID, jrnlID} = req.body;
	const userID = req.user._id;
	const now = new Date().getTime();
	const inactiveNote = 'rejected';
	// Check permission 

	Link.setLinkInactive('submitted', atomID, jrnlID, userID, now, inactiveNote)
	.then(function(updatedSubmissionLink) {
		console.log(updatedSubmissionLink);
		return res.status(201).json(updatedSubmissionLink);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/rejectAtom', rejectAtom);

