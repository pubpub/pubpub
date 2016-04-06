export function parsePluginString(str) {
	let propDict;


	//Problems escaping, see: http://stackoverflow.com/questions/36436331
	str = String(str).replace(/\n/g, "\\n")
	.replace(/\r/g, "\\r")
	.replace(/\t/g, "\\t")
	.replace(/\f/g, "\\f")
	.replace(/\\*#/g, "#")
	//.replace(/\\*l/g, "#")
	.replace(/\\*&/g, "&");
	//.replace(/\\*([^u\\])/g, function(match, p1) { return p1;});

	try {
		propDict = JSON.parse(str);
	} catch (err) {
		propDict = {};
		console.log('Could not parse JSON!');
		console.log(err);
		console.log(str);
	}

	return propDict;


	// const regex = /([^=\s]*)\s*=\s*\"?([^"]*)\"?/;
	//
	// const matches = str.match(/([^=\s,]*=(?:(?:(?=".*?")".*?")|(?:(?!".+?")[^,]+)))/g);
	//
	// if (matches) {
	// 	for (const prop of matches) {
	// 		const match = regex.exec(prop);
	// 		if (match && match[1] && match[2]) {
	// 			propDict[match[1]] = match[2];
	// 		}
	// 	}
	// }
	// return propDict;
}


export function inlineAsset(assetObj) {
	const result = assetObj.assetData;
	result._id = assetObj._id;
	result.label = assetObj.label;
	return result;
}


export function convertFirebaseToObject(firebaseObj, shouldCount = false) {
	// It seems this could be removed if we did a better job of creating the firebase
	// data to use the refNames as key to that object.
	try {
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
	} catch (err) {
		console.log(err);
		return {};
	}

}

export function convertImmutableListToObject(array, shouldCount = false) {
	try {
		const newObject = {};
		if (!array) { return newObject; }

		array.toJS().map((item, index)=> {
			newObject[item.refName] = item;
			if (shouldCount) {
				newObject[item.refName].count = index;
			}
		});
		return newObject;
	} catch (err) {
		return {};
	}

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
