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
		description: newJrnlData.description,
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
