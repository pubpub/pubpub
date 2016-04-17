const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const passportLocalMongoose = require('passport-local-mongoose');

const Discussion = require('../models').Discussion;
const Notification = require('../models').Notification;

const userSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	username: { type: String, required: true, index: { unique: true } },
	firstName: { type: String }, // Need to collect first/last for DOI assignment
	lastName: { type: String }, // Need to collect first/last for DOI assignment
	name: { type: String }, // Merged from first and last - simpler call.
	image: { type: String }, // User profile image
	thumbnail: { type: String }, // Thumbnail version of image
	title: { type: String }, // Self assigned title
	bio: { type: String }, // Self assigned bio
	groups: [{ type: ObjectId, ref: 'Group' }], // Groups that the user belongs to

	pubs: [ { type: ObjectId, ref: 'Pub' } ], // Pubs that the user has access to (due to collaborator status from within the editor)
	discussions: [ { type: ObjectId, ref: 'Discussion' } ], // Discussions the user has posted
	assets: [ { type: ObjectId, ref: 'Asset' } ], // Assets the user is an author on
	adminJournals: [ { type: ObjectId, ref: 'Journal' } ], // Journals the user is an admin for

	yays: [ { type: ObjectId, ref: 'Discussion' } ], // Yays cast
	nays: [ { type: ObjectId, ref: 'Discussion' } ], // Nays cast

	emailPublic: { type: Boolean }, // Display email publicly?

	resetHash: { type: String }, // Used for password reset
	resetHashExpiration: { type: Date }, // Used for password reset

	registerDate: { type: Date },

	settings: {
		editorFont: { type: String },
		editorFontSize: { type: String },
		editorColor: { type: String },
		editorScrollCursor: { type: String },
	},

	following: {
		pubs: [ { type: ObjectId, ref: 'Pub' } ],
		users: [ { type: ObjectId, ref: 'User' } ],
		journals: [ { type: ObjectId, ref: 'Journal' } ],
	},

	followers: [{ type: ObjectId, ref: 'User' }],
	sendNotificationDigest: { type: Boolean },
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email', digestAlgorithm: 'sha1'});

userSchema.statics.generateUniqueUsername = function(fullname, callback) {
	const self = this;

	function findUniqueName(username, count) {
		let tweakedUsername = username;
		if (count) {
			tweakedUsername = tweakedUsername + String(count);
		}

		self.findOne({username: tweakedUsername}).exec(function(err, user) {
			if (!user) {
				// console.log(tweakedUsername);
				return callback(tweakedUsername);
			}
			return findUniqueName(username, count + 1);
		});
	}

	const username = fullname.replace(/[^\w\s]/gi, '').replace(/ /g, '_').toLowerCase();
	findUniqueName(username, 0);
};

userSchema.statics.getUser = function(username, readerID, callback) {
	this.findOne({username: username})
	.populate([
		{path: 'pubs', select: 'title abstract slug collaborators createDate lastUpdated isPublished'},
		{path: 'following.pubs', select: 'title abstract slug'},
		{path: 'following.users', select: 'name username thumbnail'},
		{path: 'following.journals', select: 'customDomain journalName subdomain'},
		{path: 'groups', select: 'groupName groupSlug'},
		{path: 'followers', select: 'name username thumbnail'},
		{
			path: 'discussions',
			select: 'markdown postDate yays nays pub',
			populate: [{
				path: 'pub',
				model: 'Pub',
				select: 'title slug',
			}]
		},
	])
  .lean().exec((err, user) =>{
	if (err) { return callback(err, null); }
	if (!user) { return callback(null, 'User Not Found'); }

	const sortedPubs = {
		published: [],
		unpublished: [],
		canRead: [],
	};

	for (let index = user.pubs.length; index--;) {

		if (user.pubs[index].collaborators.canEdit.toString().split(',').indexOf(user._id.toString()) > -1) {
			if (!user.pubs[index].isPublished) {
				sortedPubs.unpublished.push(user.pubs[index]);
			} else {
				sortedPubs.published.push(user.pubs[index]);
			}
		} else {
			sortedPubs.canRead.push(user.pubs[index]);
		}
	}

	if (String(readerID) !== String(user._id)) {
		sortedPubs.unpublished = [];
		sortedPubs.canRead = [];
		user.groups = [];
	}

	const outputUser = {
		_id: user._id,
		username: user.username,
		image: user.image,
		name: user.name,
		firstName: user.firstName,
		lastName: user.lastName,
		title: user.title,
		bio: user.bio,
		pubs: sortedPubs,
		groups: user.groups,
		discussions: Discussion.calculateYayNayScore(user.discussions),
		followers: user.followers,
		following: user.following,
		notifications: [],
		sendNotificationDigest: user.sendNotificationDigest,
	};

	// This feels a bit awkward - but is nice because we don't populate notifications unless we need to - which should make load times better.
	if (String(readerID) === String(user._id)) {
		Notification.getNotifications(user._id, function(errNotificationGet, notifications) {
			outputUser.notifications = notifications;
			return callback(null, outputUser);
		});
	} else {
		return callback(null, outputUser);
	}

  });
};

module.exports = mongoose.model('User', userSchema);
