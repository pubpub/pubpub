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
	console.log(req.body.newSettings);
	res.status(201).json('hi');
});