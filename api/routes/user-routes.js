import app from '../api';
import {User, Notification, Link, Atom, Journal} from '../models';

export function getUser(req, res) {
	const reqUsername = req.user ? req.user.username : undefined;
	const userID = req.user ? req.user._id : undefined;

	let userData = {};
	User.findOne({username: req.query.username}).lean().exec()
	.then(function(userResult) {
		if (!userResult) {
			throw new Error('User does not exist');
		}
		userData = userResult;
		delete userData.firstName;
		delete userData.lastName;
		delete userData.yays;
		delete userData.nays;
		delete userData.settings;
		delete userData.registerDate;
		delete userData.following;
		delete userData.followers;
		delete userData.sendNotificationDigest;
		delete userData.email;
		return Link.find({source: userData._id, type: {$in: ['author', 'editor', 'reader']}}).lean().exec();
	})
	.then(function(linksResult) {
		const atomIDs = linksResult.map((link)=>{
			return link.destination;
		});
		return Atom.find({_id: {$in: atomIDs}}).lean().exec();
	})
	.then(function(atomsResult) {
		const findFollowingLink = Link.findOne({source: userID, destination: userData._id, type: 'followsUser', inactive: {$ne: true}}).exec();
		return [atomsResult, findFollowingLink];
	})
	.spread(function(atomsResult, followingLink) {
		if (followingLink) {
			userData.isFollowing = true;
		}
		userData.atoms = atomsResult.filter((atom)=> {
			return atom.isPublished || (userData.username === reqUsername);
		});
		return Link.find({source: userData._id, type: 'admin', inactive: {$ne: true}}).populate({
			path: 'destination',
			model: Journal,
			select: 'journalName slug icon description',
		}).exec();
	})
	.then(function(journalsResult) {
		userData.journals = journalsResult;
		return res.status(201).json(userData);
	})
	.catch(function(error) {
		if (error.message === 'User does not exist') {
			console.log(error.message);
			return res.status(404).json('404 Not Found');
		}
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.get('/getUser', getUser);

export function updateUser(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID, function(err, user) {
		if (err) { console.log(err); return res.status(500).json(err); }

		const outputObject = req.body.newDetails;
		// user = {...user, ...req.body.newDetails};
		for (const key in req.body.newDetails) {
			if (req.body.newDetails.hasOwnProperty(key)) {
				user[key] = req.body.newDetails[key];
			}
		}

		if (req.body.newDetails.image) {
			// cloudinary.uploader.upload(req.body.newDetails.image, function(cloudinaryResponse) {

			// const thumbnail = cloudinaryResponse.url ? cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50') : req.body.newDetails.image;
			const thumbnail = req.body.newDetails.image;
			// if (!cloudinaryResponse.url) {
			// 	console.log('cloudinaryResponse did not have url. Here is the response:');
			// 	console.log(cloudinaryResponse);
			// }
			user.thumbnail = thumbnail;
			outputObject.thumbnail = thumbnail;
			user.save(function(errUserSave, result) {
				if (errUserSave) { return res.status(500).json(errUserSave); }
				return res.status(201).json(outputObject);
			});
			// });
		} else {
			user.save(function(errUserSave, result) {
				if (errUserSave) { return res.status(500).json(errUserSave); }
				// console.log('outputObject', outputObject);
				return res.status(201).json(outputObject);
			});

		}
	});
}
app.post('/updateUser', updateUser);

export function updateUserSettings(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	User.findById(req.user._id, function(err, user) {

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		user.settings = user.settings ? user.settings : {};
		user.settings[settingKey] = req.body.newSettings[settingKey];

		user.save(function(errUserSave, result) {
			if (errUserSave) { return res.status(500).json(errUserSave); }

			return res.status(201).json(user.settings);
		});

	});
}
app.post('/updateUserSettings', updateUserSettings);

export function follow(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;
	const type = req.body.type;
	const followID = req.body.followID;
	const now = new Date().getTime();

	Link.findOne({source: userID, destination: followID, type: type, inactive: {$ne: true}}).exec()
	.then(function(existingLink) {
		if (existingLink) {			
			throw new Error('Following Link already exists');
		}
		return Link.createLink(type, userID, followID, userID, now);
	})
	.then(function(createdLink) {
		return res.status(201).json(createdLink);
	})
	.catch(function(error) {
		console.log('Error Creating Follow link', error);
		return res.status(500).json(error);
	});
}
app.post('/follow', follow);

export function unfollow(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;
	const type = req.body.type;
	const followID = req.body.followID;
	const now = new Date().getTime();

	Link.findOne({source: userID, destination: followID, type: type, inactive: {$ne: true}}).exec()
	.then(function(existingLink) {
		if (!existingLink) {			
			throw new Error('No Following Link exists');
		}
		return Link.setLinkInactive(type, userID, followID, userID, now, 'unfollowed');
	})
	.then(function(updatedLink) {
		return res.status(201).json(updatedLink);
	})
	.catch(function(error) {
		console.log('Error Creating Follow link', error);
		return res.status(500).json(error);
	});
}
app.post('/unfollow', unfollow);

export function setNotificationsRead(req, res) {
	if (!req.user) {
		return res.status(201).json(false);
	}

	if (req.user._id && String(req.user._id) !== String(req.body.userID) ) {
		console.log('userIDs do not match');
		return res.status(201).json(false);
	}

	Notification.setRead({recipient: req.body.userID}, ()=>{});
	Notification.setSent({recipient: req.body.userID}, ()=>{});
	return res.status(201).json(true);

}
app.post('/setNotificationsRead', setNotificationsRead);
