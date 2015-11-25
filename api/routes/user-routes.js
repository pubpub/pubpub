var app = require('../api');

var User = require('../models').User;

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