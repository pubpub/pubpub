export function parsePluginString(str) {
	const propDict = {};
	const regex = /([^=\s]*)\s*=\s*\"?([^"]*)\"?/;

	const matches = str.match(/([^=\s,]*=(?:(?:(?=".*?")".*?")|(?:(?!".+?")[^,]+)))/g);

	if (matches) {
		for (const prop of matches) {
			const match = regex.exec(prop);
			if (match && match[1] && match[2]) {
				propDict[match[1]] = match[2];
			}
		}
	}
	return propDict;
}

export function convertFirebaseToObject(firebaseObj, shouldCount = false) {
	// It seems this could be removed if we did a better job of creating the firebase
	// data to use the refNames as key to that object.
	let count = 0;
	return Object.keys(firebaseObj || {}).reduce(function(obj, key) {
		const asset = firebaseObj[key];
		obj[asset.refName] = asset;
		if (shouldCount) {
			obj[asset.refName].count = count;
			count++;
		}
		return obj;
	}, {});
}

export function convertImmutableListToObject(array, shouldCount = false) {
	const newObject = {};
	if (!array) { return newObject; }

	array.toJS().map((item, index)=> {
		newObject[item.refName] = item;
		if (shouldCount) {
			newObject[item.refName].count = index;
		}
	});
	return newObject;
}

export function convertListToObject(array, shouldCount = false) {
	const newObject = {};
	if (!array) { return newObject; }

	array.map((item, index)=> {
		newObject[item.refName] = item;
		if (shouldCount) {
			newObject[item.refName].count = index;
		}
	});
	return newObject;
}


/*
export function getAssetInformation(propDict, assets, assetType) {
	const refName = propDict.src || 'none';
	const asset = assets.find(asst => (asst.refName === refName));
	let url = null;
	if (asset && asset.assetType === 'image') {
		url = asset.url_s3;
	} else if (asset) {
		url = 'error:type';
	}
	propDict.url = url;
	return propDict;
}
*/
