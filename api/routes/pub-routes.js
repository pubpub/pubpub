var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;

var _         = require('underscore');
var Firebase  = require('firebase');

app.get('/getPub', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	
	Pub.getPub(req.query.slug, userID, (err, pubData)=>{
		
		if (err) {
			console.log(err);
			return res.status(500).json(err); 
		}

		return res.status(201).json(pubData);

	});
});

app.get('/getPubEdit', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	Pub.getPubEdit(req.query.slug, userID, (err, pubEditData)=>{
		if (err) {
			console.log(err);
			return res.status(500).json(err); 
		}

		return res.status(201).json(pubEditData);

	});
});

app.post('/createPub', function(req, res) {
	const userID = req.user ? req.user._id : undefined;

	Pub.isUnique(req.body.slug, (err, result)=>{
		if(!result){ return res.status(500).json('URL Title is not Unique!'); }

		const pub = new Pub({
			title: req.body.title,
			slug: req.body.slug,
			abstract: 'Type your abstract here',
			collaborators: {
				canEdit:[userID], 
				canRead:[] 
			},
			createDate: new Date().getTime(),
			status: 'Unpublished',
			assets: [], 
			history: [],
			followers: [],
			featuredIn: [],
			submittedTo: [],
			reviews: [],
			discussions: [],
			experts: {
				approved: [],
				suggested: []
			}
		});
		console.log(pub);
	  
		pub.save(function (err, savedPub) {
			if (err) { return res.status(500).json(err);  }

			const pubID = savedPub.id;
			const userID = req.user['_id'];

			User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			const ref = new Firebase('https://pubpub.firebaseio.com/' + req.body.slug + '/editorData/collaborators' );
			ref.set({}); // Clear just in case
			ref.push({
				name: req.user.name,
				username: req.user.username,
				email: req.user.email,
				image: req.user.image,
				thumbnail: req.user.thumbnail,
				permission: 'edit',
				admin: true,
			});

			return res.status(201).json(savedPub.slug);
		});

	});

});

app.post('/updatePub', function(req, res) {
	// push updates to pub doc, 
	// handle updates to other docs
});

app.post('/publishPub', function(req, res) {
	console.log(req.body);
	console.log(req.user._id);
	// return res.status(201).json('Go!');
	// Check that the req.user is an editor on the pub. 
	// Beef out the history object with date, etc
	// Update the pub object with new dates, titles, etc
	// Push the new history object

	Pub.findOne({ slug: req.body.newVersion.slug }, function (err, pub){
		if (err) { return res.status(500).json(err);  }

		console.log(pub);
		if (pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}
		// doc.name = 'jason borne';
		pub.title = req.body.newVersion.title;
		pub.abstract = req.body.newVersion.abstract;
		pub.authorsNote = req.body.newVersion.authorsNote;
		pub.markdown = req.body.newVersion.markdown;
		pub.assets = req.body.newVersion.assets;
		pub.style = req.body.newVersion.style;
		pub.lastUpdated = new Date().getTime(),
		pub.status = req.body.newVersion.status;
		pub.history.push({
			publishNote: req.body.newVersion.publishNote,
			publishDate: new Date().getTime(),
			publishAuthor: req.user._id,
			diffToLastPublish: '',
			title: req.body.newVersion.title,
			abstract: req.body.newVersion.abstract,
			authorsNote: req.body.newVersion.authorsNote,
			markdown: req.body.newVersion.markdown,
			authors: req.body.newVersion.authors,
			assets: req.body.newVersion.assets,
			style: req.body.newVersion.style,
			status: req.body.newVersion.status,
		});
		pub.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			console.log('in save result');
			console.log(result);
			return res.status(201).json('Published new version');
		});
	});
});





