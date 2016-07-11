const app = require('../api');
const Jrnl = require('../models').Jrnl;
const Link = require('../models').Link;

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
	Jrnl.findOne({slug: req.query.slug}).exec()
	.then(function(jrnlData) {
		return res.status(201).json(jrnlData);
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
		return res.status(201).json(savedResult);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/updateJrnl', updateJrnl);

export function featureAtom(req, res) {
	const {atomID, journalID} = req.query;
	const userID = req.user._id;
	const now = new Date().getTime();
	const inactiveNote = undefined;
	// Check permission 

	Link.createLink('featured', journalID, atomID, now, userID)
	.then(function() {
		return Link.setLinkInactive('submitted', atomID, journalID, now, userID, inactiveNote);
	})
	.then(function() {
		return res.status(201).json('Featured');
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/featureAtom', featureAtom);

