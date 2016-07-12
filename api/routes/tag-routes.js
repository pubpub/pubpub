const app = require('../api');
const Jrnl = require('../models').Jrnl;
const Link = require('../models').Link;
const Tag = require('../models').Tag;

export function createTag(req, res) {
	if (!req.user) { return res.status(403).json('Not Logged In'); }

	console.log(req.body);
	return res.status(201).json('yep');
	const now = new Date().getTime();
	const userID = req.user._id;

	const tag = new Tag({
		title: req.body.title,
		jrnl: req.body.jrnlID,
		createDate: now,
	});


	tag.save()
	.then(function(newTag) {
		if (!req.body.jrnlID) { return; }
		return [newTag, Jrnl.update({ _id: req.body.jrnlID }, { $push: { collections: {$each: [newTag._id], $position: 0}} }).exec()];
	})
	.spread(function(newTag, jrnlUpdateResult) { // Send response
		return res.status(201).json(newJrnlData.slug);
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/createTag', createTag);
