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
			},
			settings: {
				pubPrivacy: 'public',
			}
		});
		// console.log(pub);
	  
		pub.save(function (err, savedPub) {
			if (err) { return res.status(500).json(err);  }

			const pubID = savedPub.id;
			const userID = req.user['_id'];

			User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			const ref = new Firebase('https://pubpub.firebaseio.com/' + req.body.slug + '/editorData' );
			const newEditorData = {
				collaborators: {},
				settings: {},
			};
			newEditorData.collaborators[req.user.username] = {
				_id: userID.toString(),
				name: req.user.name,
				username: req.user.username,
				email: req.user.email,
				thumbnail: req.user.thumbnail,
				permission: 'edit',
				admin: true,
			};
			newEditorData.settings.pubPrivacy = 'public';
			ref.set(newEditorData);

			return res.status(201).json(savedPub.slug);
		});

	});

});

app.post('/updatePub', function(req, res) {
	// push updates to pub doc, 
	// handle updates to other docs
});

app.post('/publishPub', function(req, res) {

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

app.post('/updateCollaborators', function(req, res) {
	Pub.findOne({ slug: req.body.slug }, function (err, pub){
		if (err) { return res.status(500).json(err);  }

		// Check to make sure the user is authorized to be submitting such changes.
		if (pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		const pubID = pub._id;
		const canEdit = [];
		const canRead = [];
		// Iterate through each user in the collaborators object, add them to appropriate array.
		_.forEach(req.body.newCollaborators, function(collaborator){
			if (collaborator.permission === 'edit') {
				canEdit.push(collaborator._id);
				// Update the user's pubs collection so it is bound to their profile
				User.update({ _id: collaborator._id }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			} else {
				canRead.push(collaborator._id);
				// Update the user's pubs collection so it is removed from their profile
				User.update({ _id: collaborator._id }, { $pull: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
			}
		});
		const collaborators = {
			canEdit: canEdit,
			canRead: canRead
		};

		if (req.body.removedUser) {
			User.update({ _id: req.body.removedUser }, { $pull: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
		}
		// console.log(collaborators);
		Pub.update({slug: req.body.slug}, { $set: { collaborators: collaborators }}, function(result){
			// console.log(result);
			res.status(201).json('Collaborator Data Saved');
		})
	});
	// For each of the canEdits, need to update their Pubs access stuff

});


app.post('/updatePubSettings', function(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	Pub.findOne({slug: req.body.slug}, function(err, pub){
		
		if (err) {
			console.log(err);
			return res.status(500).json(err); 
		}

		if (pub.collaborators.canEdit.indexOf(req.user._id) === -1) {
			return res.status(403).json('Not authorized to publish versions to this pub');
		}

		pub.settings[settingKey] = req.body.newSettings[settingKey];

		pub.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(pub.settings);
		});

	});
});
