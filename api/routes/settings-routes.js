const app = require('../api');
const passport = require('passport');

const User = require('../models').User;

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
		});
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});
}
app.post('/saveUserSettings', saveUserSettings);
