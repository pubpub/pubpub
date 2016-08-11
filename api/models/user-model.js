const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	username: { type: String, required: true, index: { unique: true } },
	firstName: { type: String }, // Need to collect first/last for DOI assignment
	lastName: { type: String }, // Need to collect first/last for DOI assignment
	name: { type: String }, // Merged from first and last - simpler call.
	image: { type: String }, // User profile image
	
	bio: { type: String }, // Self assigned bio
<<<<<<< Updated upstream
	publicEmail: { type: String }, // Publicly listed email
	github: { type: String }, // Github account
	orcid: { type: String }, // orcid number
	twitter: { type: String }, // twitter handle
	website: { type: String }, // website url
	googleScholar: { type: String }, // googleScholar id
=======
	github: { type: String }, // Github account
	orcid: { type: String }, // orcid number
	twitter: { type: String }, // twitter hadnle
	website: { type: String }, // website url
	googleScholar: { type: String }, // googleScholar id

	groups: [{ type: ObjectId, ref: 'Group' }], // Groups that the user belongs to

	pubs: [ { type: ObjectId, ref: 'Pub' } ], // Pubs that the user has access to (due to collaborator status from within the editor)
	discussions: [ { type: ObjectId, ref: 'Discussion' } ], // Discussions the user has posted
	assets: [ { type: ObjectId, ref: 'Asset' } ], // Assets the user is an author on
	adminJournals: [ { type: ObjectId, ref: 'Journal' } ], // Journals the user is an admin for
>>>>>>> Stashed changes

	yays: [ { type: ObjectId, ref: 'Discussion' } ], // Yays cast
	nays: [ { type: ObjectId, ref: 'Discussion' } ], // Nays cast

	verificationHash: { type: String },
	verifiedEmail: { type: Boolean },

	verificationHash: { type: String },
	verifiedEmail: { type: Boolean },

	resetHash: { type: String }, // Used for password reset
	resetHashExpiration: { type: Date }, // Used for password reset

	registerDate: { type: Date },

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


module.exports = mongoose.model('User', userSchema);
