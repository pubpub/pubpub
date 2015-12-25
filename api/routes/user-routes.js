var app = require('../api');

var User = require('../models').User;
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
				console.log('outputObject', outputObject);
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