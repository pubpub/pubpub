const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Journal = require('../models').Journal;

const notificationSchema = new Schema({
	type: { type: String },
	createDate: { type: Date },
	read: { type: Boolean },
	emailSent: { type: Boolean },

	pub: { type: ObjectId, ref: 'Pub' },
	sourceHost: { type: String },
	sourceJournal: { type: ObjectId, ref: 'Journal' },
	discussion: { type: ObjectId, ref: 'Discussion' },
	sender: { type: ObjectId, ref: 'User' },
	recipient: { type: ObjectId, ref: 'User', required: true, index: true },
});

notificationSchema.statics.getNotification = function(notificationID, callback) {
	this.findById(notificationID)
	.exec(function(err, notification) {
		if (err) callback(err);
		callback(null, notification);
	});
};

notificationSchema.statics.setRead = function(query, callback) {
	this.update(query, { $set: { read: true }}, { multi: true }).exec(function(err, notifications) {
		if (err) callback(err, false);
		callback(null, true);
	});
};

notificationSchema.statics.setSent = function(query, callback) {
	this.update(query, { $set: { emailSent: true }}, { multi: true }).exec(function(err, notifications) {
		if (err) callback(err, false);
		callback(null, true);
	});
};

notificationSchema.statics.getUnreadCount = function(user, callback) {
	this.find({recipient: user, read: false}).count(function(err, count) {
		if (err) callback(err, 0);
		callback(null, count);
	});
	return;
};

notificationSchema.statics.getNotifications = function(user, callback) {

	this.find({'recipient': user})
	.sort({'createDate': -1})
	.populate([
		{path: 'pub', select: 'title slug'},
		{path: 'sender', select: 'name firstName lastName username thumbnail'},
		{path: 'recipient', select: 'name firstName lastName username thumbnail'},
		{path: 'discussion', select: 'version'},
	])
	.lean()
	.exec(function(err, notifications) {
		if (err) callback(err);
		callback(null, notifications);
	});
	return;
};

notificationSchema.statics.createNotification = function(type, sourceHost, sender, recipient, pub, discussion) {
	const date = new Date().getTime();
	const Notification = this;

	if (String(sender) === String(recipient)) {
		return;
	}

	const validTypes = [
		'discussion/repliedTo',
		'discussion/pubComment',
		'follows/followedYou',
		'follows/followedPub',
		'followers/newPub',
		'followers/newVersion',
	];

	if (validTypes.indexOf(type) === -1) {
		console.log('Invalid type: ' + type);
		return;
	}

	Journal.findOne({ $or: [ {subdomain: sourceHost.split('.')[0]}, {customDomain: sourceHost}]}, {'_id': 1}).lean().exec(function(err, journal) {
		const sourceJournal = journal ? journal._id : undefined;

		const notification = new Notification({
			type: type,
			createDate: date,
			read: false,
			emailSent: false,

			pub: pub,
			sourceHost: sourceHost,
			sourceJournal: sourceJournal,
			discussion: discussion,
			sender: sender,
			recipient: recipient,
		});

		notification.save(function(errSaveNotification, notificationSaved) {
			if (errSaveNotification) { console.log(err); }
			// console.log(notification);
			return;
		});
	});
};


const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
