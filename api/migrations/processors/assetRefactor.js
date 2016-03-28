import Asset from '../../models/asset-model.js'

function convertAsset(pub, asset) {

	const assetData ={
		filetype: asset.filetype,
		originalFilename: asset.originalFilename,
		thumbnail: asset.thumbnail,
		url: asset.url,
	};

	var assetModel = {
		assetType: asset.assetType,
		label: asset.refName,
		assetData: assetData,
		history: [{
			assetType:	asset.assetType,
			label:	asset.refName,
			assetData: assetData,
			updateDate: asset.createDate,
		}],

		usedInDiscussions: [],
		usedInPubs: [{
			id: pub._id,
			version: pub.history.length, //indexed one or not?
		}],

		parent: null,
		root: null,

		authors: [asset.owner], // Authors have edit access to the asset

		createDate: asset.createDate,
		lastUpdated: asset.createDate,
	};


	return assetModel;
}

function convertReference(pub, reference) {

	const assetData ={
		title: reference.title,
		url: reference.url,
		journal: reference.journal,
		volume: reference.volume,
		number: reference.number,
		pages: reference.pages,
		year: reference.year,
		publisher: reference.publisher,
		doi: reference.doi,
		note: reference.note,
	};

	var assetModel = {
		assetType: reference.assetType,
		label: reference.refName,
		assetData: assetData,
		history: [{
			assetType:	reference.assetType,
			label:	reference.refName,
			assetData: assetData,
			updateDate: reference.createDate,
		}],

		usedInDiscussions: [],
		usedInPubs: [{
			id: pub._id,
			version: pub.history.length, // indexed one or not?
		}],

		parent: null,
		root: null,
		authors: [reference.owner], // Authors have edit access to the asset
		createDate: reference.createDate,
		lastUpdated: reference.createDate,
	};


	return assetModel;
}

export default function processor({pub, assets, references, callback}) {

	try {
		const assetModels = assets.map((asset) => convertAsset(pub, asset));
		const referenceModels = references.map((reference) => convertReference(pub, reference));
		const insertModels = assetModels.concat(referenceModels);

		// callback(null, insertModels);

		Asset.create(insertModels, function(err, assets) {
			if (err) return callback(err);
			return callback(null, assets);
		});


	} catch (err1) {
		callback(err1);
	}




}
