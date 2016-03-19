import app from '../api';
import {User, Asset} from '../models';


app.post('/assetCreate', function(req, res) {
	if(!req.user) { return res.status(500).json('User not logged in'); }

	const newAsset = new Asset();
	newAsset.assetType = req.body.assetObject.assetType;
	newAsset.label = req.body.assetObject.label;
	newAsset.assetData = req.body.assetObject.assetData;
	newAsset.createDate = new Date().getTime();
	newAsset.lastUpdated = newAsset.createDate;
	newAsset.authors = [req.user._id];
	newAsset.history = [];

	newAsset.save(function(err, savedAsset) {
		if (err) { return res.status(500).json(err);  }
		console.log('saved asset is', savedAsset);
		User.update({ _id: req.user._id }, { $addToSet: { assets: savedAsset._id} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(savedAsset);
	});

});