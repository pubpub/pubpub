var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;

var _         = require('underscore');

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
				authors:[userID], 
				readers:[] 
			},
			createDate: new Date().getTime(),
			status: 'Draft',
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

			return res.status(201).json(savedPub.slug);
		});

	});

});

app.post('/updatePub', function(req, res) {
	// push updates to pub doc, 
	// handle updates to other docs
});

app.post('/publishPub', function(req, res) {
	
});
