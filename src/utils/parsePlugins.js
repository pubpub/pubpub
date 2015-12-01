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

export function createPluginString(pluginType, content, refs) {
	let outputVariables = '';
	for (const key in content) {
		// Generate an output string based on the key, values in the object
		if (Object.prototype.hasOwnProperty.call(content, key)) {
			const val = refs['pluginInput-' + key].value;

			if (val && val.length) {
				outputVariables += key + '=' + val + ', ';
			}
		}
	}
	outputVariables = outputVariables.slice(0, -2); // Remove the last comma and space
	const mergedString = outputVariables.length ? pluginType + ': ' + outputVariables : pluginType;
	return mergedString;
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
