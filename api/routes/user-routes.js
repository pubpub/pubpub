import app from '../api';
import {User, Pub, Journal, Notification} from '../models';

import {cloudinary} from '../services/cloudinary';
import {sendInviteEmail} from '../services/emails';

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

app.post('/updateUser', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID, function(err, user){
		if (err) { console.log(err); return res.status(500).json(err); }

		const outputObject = req.body.newDetails;
		// user = {...user, ...req.body.newDetails};
		for (const key in req.body.newDetails) {
			if (req.body.newDetails.hasOwnProperty(key)) {
				user[key] = req.body.newDetails[key];
			}
		}

		if (req.body.newDetails.image) {
			cloudinary.uploader.upload(req.body.newDetails.image, function(cloudinaryResponse) {

				const thumbnail = cloudinaryResponse.url ? cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50') : req.body.newDetails.image;
				if (!cloudinaryResponse.url) {
					console.log('cloudinaryResponse did not have url. Here is the response:');
					console.log(cloudinaryResponse);
				}
				user.thumbnail = thumbnail;
				outputObject.thumbnail = thumbnail;
				user.save(function(err, result){
					if (err) { return res.status(500).json(err);  }
					return res.status(201).json(outputObject);
				});
			});
		} else {
			user.save(function(err, result){
				if (err) { return res.status(500).json(err);  }
				// console.log('outputObject', outputObject);
				return res.status(201).json(outputObject);
			});

		}
	});

});

app.post('/updateUserSettings', function(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	User.findById(req.user._id, function(err, user){

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		user.settings = user.settings ?  user.settings : {};
		user.settings[settingKey] = req.body.newSettings[settingKey];

		user.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(user.settings);
		});

	});
});

app.post('/follow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $addToSet: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		Pub.findOne({_id: req.body.followedID}, {'authors':1}).lean().exec(function (err, pub) {
			if (pub) {
				pub.authors.map((author)=>{
					Notification.createNotification('follows/followedPub', req.body.host, userID, author, pub._id);
				});
			} 
		});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $addToSet: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		Notification.createNotification('follows/followedYou', req.body.host, userID, req.body.followedID);
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $addToSet: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}

});

app.post('/unfollow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $pull: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $pull: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $pull: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}


});


app.post('/inviteReviewers', function(req, res) {
	const inviteData = req.body.inviteData;
	const pubId = req.body.pubID;
	Pub.getSimplePub(pubId, function(err, pub) {

		if (err) {res.status(500); }
		const senderName = req.user ? req.user.name : 'An anonymous user';
		const pubName = pub.title;
		

		Journal.findByHost(req.query.host, function(err, journ) {
			
			const journalName = journ ? journ.journalName : 'PubPub';
			let journalURL = '';
			if (journ) {
				journalURL = journ.customDomain ? 'http://' + journ.customDomain : 'http://' + journ.subdomain + '.pubpub.org';
			} else {
				journalURL = 'http://www.pubpub.org'
			}

			const journalIntroduction = journ ? journalName + ' is a journal built on PubPub:' : 'PubPub is';

			const pubURL = journalURL + '/pub/' + pub.slug;

			for (let recipient of inviteData) {
				const recipientEmail = recipient.email;
				
				sendInviteEmail(senderName, pubName, pubURL, journalName, journalURL, journalIntroduction, recipientEmail, function(error, email) {
					if (err) {
						console.log(error);	
					}
					// console.log(email);
				});

			}

			res.status(201).json({});
		});

	});


});

app.post('/setNotificationsRead', function(req, res) {
	if (!req.user) {
		return res.status(201).json(false);
	}
	
	if (req.user._id && String(req.user._id) !== String(req.body.userID) ) {
		console.log('userIDs do not match');
		return res.status(201).json(false);
	}

	Notification.setRead({recipient: req.body.userID}, ()=>{});
	Notification.setSent({recipient: req.body.userID}, ()=>{});
	return res.status(201).json(true)

});

