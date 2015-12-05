export function parsePluginString(str) {
	const propDict = {};
	const regex = /([^=\s]*)\s*=\s*(.*)/;
	for (const prop of str.split(',')) {
		const match = regex.exec(prop);
		if (match && match[1] && match[2]) {
			propDict[match[1]] = match[2];
		}
	}
	return propDict;
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
