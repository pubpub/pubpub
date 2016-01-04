var app = require('../api');

var User = require('../models').User;
var Pub = require('../models').Pub;
var Journal = require('../models').Journal;

import {cloudinary} from '../services/cloudinary';

app.get('/getUser', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	
	User.getUser(req.query.username, userID, (err, userData)=>{
		
		if (err) {
			console.log(err);
			return res.status(500).json(err); 
		}

		return res.status(201).json(userData);

	});
  
});

app.post('/updateUser', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID, function(err, user){
		if (err) { console.log(err); return res.status(500).json(err); }

		const outputObject = req.body.newDetails;
		// user = {...user, ...req.body.newDetails};
		for (const key in req.body.newDetails) {
			if (req.body.newDetails.hasOwnProperty(key)) {
				user[key] = req.body.newDetails[key];
			}
		}

		if (req.body.newDetails.image) {
			cloudinary.uploader.upload(req.body.newDetails.image, function(cloudinaryResponse) { 
				const thumbnail = cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50'); 
				
				user.thumbnail = thumbnail;
				outputObject.thumbnail = thumbnail;
				user.save(function(err, result){
					if (err) { return res.status(500).json(err);  }
					return res.status(201).json(outputObject);
				});
			});
		} else {
			user.save(function(err, result){
				if (err) { return res.status(500).json(err);  }
				// console.log('outputObject', outputObject);
				return res.status(201).json(outputObject);
			});
			
		}
	});
  
});

app.post('/updateUserSettings', function(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	User.findById(req.user._id, function(err, user){
		
		if (err) {
			console.log(err);
			return res.status(500).json(err); 
		}

		user.settings = user.settings ?  user.settings : {};
		user.settings[settingKey] = req.body.newSettings[settingKey];

		user.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(user.settings);
		});

	});
});

app.post('/follow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $addToSet: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $addToSet: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $addToSet: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default: 
		return res.status(500).json('Invalid type');	
	}
	
});

app.post('/unfollow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $pull: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $pull: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $pull: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default: 
		return res.status(500).json('Invalid type');	
	}
		
	
});

