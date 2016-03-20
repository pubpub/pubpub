import app from '../api';
import {User, Asset} from '../models';


app.post('/assetCreate', function(req, res) {
	if(!req.user) { return res.status(500).json('User not logged in'); }

	const currentTime = new Date().getTime();
	const newAsset = new Asset();
	newAsset.assetType = req.body.assetObject.assetType;
	newAsset.label = req.body.assetObject.label;
	newAsset.assetData = req.body.assetObject.assetData;
	newAsset.createDate = currentTime;
	newAsset.lastUpdated = currentTime;
	newAsset.authors = [req.user._id];

	const historyItem = {
		assetType: req.body.assetObject.assetType,
		label: req.body.assetObject.label,
		assetData: req.body.assetObject.assetData,
		updateDate: currentTime,
	};
	newAsset.history = [historyItem];

	newAsset.save(function(err, savedAsset) {
		if (err) { return res.status(500).json(err);  }
		console.log('saved asset is', savedAsset);
		User.update({ _id: req.user._id }, { $addToSet: { assets: savedAsset._id} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(savedAsset);
	});

});

app.post('/assetUpdate', function(req, res) {
	if(!req.user) { return res.status(500).json('User not logged in'); }

	Asset.findOne({'_id':req.body._id}, function(err, asset){
		if (err) { return res.status(500).json(err);  }
		if (!asset) { return res.status(500).json('No asset found');  }

		const currentTime = new Date().getTime();
		asset.assetType = req.body.assetObject.assetType;
		asset.label = req.body.assetObject.label;
		asset.assetData = req.body.assetObject.assetData;
		asset.authors = req.body.assetObject.authors;
		asset.lastUpdated = currentTime
		const historyItem = {
			assetType: req.body.assetObject.assetType,
			label: req.body.assetObject.label,
			assetData: req.body.assetObject.assetData,
			updateDate: currentTime,
		};
		asset.history.push(historyItem);
		asset.save(function(err, savedAsset) {
			if (err) { return res.status(500).json(err);  }
			return res.status(201).json(savedAsset);
		});

	});

});