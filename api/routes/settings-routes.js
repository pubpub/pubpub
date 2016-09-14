const app = require('../api');

const User = require('../models').User;

const Promise = require('bluebird');
const randomBytes = Promise.promisify(require("crypto").randomBytes);

export function saveUserSettings(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID).exec()
	.then(function(result) {
		// Validate and clean submitted values
		const newSettings = req.body.settings;
		result.firstName = newSettings.firstName;
		result.lastName = newSettings.lastName;
		result.name = result.firstName + ' ' + result.lastName;
		result.image = newSettings.image;
		result.publicEmail = newSettings.publicEmail;
		result.bio = newSettings.bio && newSettings.bio.substring(0, 140);
		result.website = newSettings.website;
		result.twitter = newSettings.twitter;
		result.orcid = newSettings.orcid;
		result.github = newSettings.github;
		result.googleScholar = newSettings.googleScholar;
		result.featuredAtoms = newSettings.featuredAtoms;
		return result.save();
	})
	.then(function(savedResult) {
		return res.status(201).json({
			firstName: savedResult.firstName,
			lastName: savedResult.lastName,
			name: savedResult.name,
			image: savedResult.image,
			bio: savedResult.bio,
			publicEmail: savedResult.publicEmail,
			website: savedResult.website,
			twitter: savedResult.twitter,
			orcid: savedResult.orcid,
			github: savedResult.github,
			googleScholar: savedResult.googleScholar,
			featuredAtoms: savedResult.featuredAtoms,
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/saveUserSettings', saveUserSettings);

// Generate an access token and store it with user
export function generateToken(req, res) {
	randomBytes(48)
	.then(function(bytes) {
		return bytes.toString('hex');

	})
	.then(function(token) {
		return [User.findOne({_id: req.user._id}).exec(), token];
	})
	.spread(function(user, token) {
		user.accessToken = token;
		user.save();
		return res.status(201).json({accessToken: token});
	});
}

app.get('/generateToken', generateToken);
