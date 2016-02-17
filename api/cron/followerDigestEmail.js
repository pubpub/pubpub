require('../../server.babel'); // babel registration (runtime transpilation for node)

var mongoose = require('mongoose');
var mongoURI = process.env.NODE_ENV !== 'production' ? require('../authentication/mongoCredentials').mongoURI : process.env.mongoURI;
mongoose.connect(mongoURI);  

var sendNotificationDigest = require('../services/emails').sendNotificationDigest ;

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Discussion = require('../models').Discussion;
var Notification = require('../models').Notification;

function sendfollowerDigest () {

	console.log('Starting sendfollowerDigest.');

	User.find({sendNotificationDigest: {$ne: false}}, {'_id':1, 'name':1, 'email': 1, 'username': 1}).lean().exec(function(err, users) {
		var usersProcessed = 0;
		users.forEach(function(user, index) {
			if(user) {
				Notification.find({read: false, emailSent: false, recipient: user._id})
				.sort({'createDate': -1})
				.populate([ 
					{path: "pub", select:"title slug"},
					{path: "sender", select:"name firstName lastName username thumbnail"},
					{path: "recipient", select:"name firstName lastName username thumbnail"},
					{path: "discussion", select:"version"},
				])
				.lean().exec(function(err, notifications) {
					
					if (notifications.length) {
						sendNotificationDigest(notifications, user.email, user.username, function(err, email) {
							Notification.setSent({recipient: user._id}, function(err, result) {
								console.log('Sent digest to ' + user.email + '. Total notifications: ' + notifications.length);
								usersProcessed += 1;
								if (usersProcessed >= users.length) {
									console.log('Closing mongoose connection.');
									mongoose.disconnect();
									process.exit();
								}	
							});	
						});
					} else {
						usersProcessed += 1;
						if (usersProcessed >= users.length) {
							console.log('Closing mongoose connection.');
							mongoose.disconnect();
							process.exit();
						}	
					}
					
				});
			} else {
				usersProcessed += 1;
				if (usersProcessed >= users.length) {
					console.log('Closing mongoose connection.');
					mongoose.disconnect();
					process.exit();
				}
			}
		});
	});
}

sendfollowerDigest();