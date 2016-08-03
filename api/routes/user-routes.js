import app from '../api';
import {User, Pub, Notification, Link, Atom, Journal} from '../models';

export function getUser(req, res) {
	const reqUsername = req.user ? req.user.username : undefined;
	let userData = {};
	User.findOne({username: req.query.username}).lean().exec()
	.then(function(userResult) {
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

	switch (req.body.type) {
	case 'pubs':
		User.update({ _id: userID }, { $addToSet: { 'following.pubs': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		Pub.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		Pub.findOne({_id: req.body.followedID}, {authors: 1}).lean().exec(function(err, pub) {
			if (pub) {
				pub.authors.map((author)=>{
					Notification.createNotification('follows/followedPub', req.body.host, userID, author, pub._id);
				});
			}
		});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $addToSet: { 'following.users': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		Notification.createNotification('follows/followedYou', req.body.host, userID, req.body.followedID);
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $addToSet: { 'following.journals': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		// Journal.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}

}
app.post('/follow', follow);

export function unfollow(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type) {
	case 'pubs':
		User.update({ _id: userID }, { $pull: { 'following.pubs': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		Pub.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $pull: { 'following.users': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		User.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $pull: { 'following.journals': req.body.followedID} }, function(err, result) {if (err) return console.log(err);});
		// Journal.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result) {if (err) return console.log(err);});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}
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
