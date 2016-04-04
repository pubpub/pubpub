require('../../server.babel'); // babel registration (runtime transpilation for node)

const mongoose = require('mongoose');
const mongoURI = process.env.NODE_ENV !== 'production' ? require('../config').mongoURI : process.env.mongoURI;
mongoose.connect(mongoURI);

const sendNotificationDigest = require('../services/emails').sendNotificationDigest;

const User = require('../models').User;
const Notification = require('../models').Notification;

function sendfollowerDigest() {
	User.find({sendNotificationDigest: {$ne: false}}, {'_id': 1, 'name': 1, 'email': 1, 'username': 1}).lean().exec(function(err, users) {
		let usersProcessed = 0;
		users.forEach(function(user, index) {
			if (user) {
				Notification.find({read: false, emailSent: false, recipient: user._id})
				.sort({'createDate': -1})
				.populate([
					{path: 'pub', select: 'title slug'},
					{path: 'sender', select: 'name firstName lastName username thumbnail'},
					{path: 'recipient', select: 'name firstName lastName username thumbnail'},
					{path: 'discussion', select: 'version'},
				])
				.lean().exec(function(errNotification, notifications) {

					if (notifications.length) {
						sendNotificationDigest(notifications, user.email, user.username, function(errSendNotification, email) {
							Notification.setSent({recipient: user._id}, function(errNotificationSet, result) {
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
