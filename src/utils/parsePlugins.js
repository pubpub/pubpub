export function parsePluginString(pluginStr) {
	let propDict;


	// Problems escaping, see: http://stackoverflow.com/questions/36436331

	let str;
	if (pluginStr.slice(0, 2) === '[[' && pluginStr.slice(pluginStr.length - 2, pluginStr.length) === ']]') {
		str = pluginStr.slice(2, pluginStr.length - 2);
	} else {
		str = pluginStr;
	}

	const replacedStr = String(str).replace(/\n/g, '\\n')
	.replace(/\r/g, '\\r')
	.replace(/\t/g, '\\t')
	.replace(/\f/g, '\\f')
	.replace(/\\U/g, '\\f')
	.replace(/\\*#/g, '#')
	// .replace(/\\*l/g, '#')
	.replace(/\\*&/g, '&')
	.replace(/\\+{/g, '')
	.replace(/\\+}/g, '')
	.replace(/\\*%/g, '%');

	// .replace(/\\*([^u\\])/g, function(match, p1) { return p1;});

	try {
		propDict = JSON.parse(replacedStr);
	} catch (err) {
		propDict = {};
		console.log('Could not parse JSON!');
		console.log(err);
		console.log(str);
		console.log(replacedStr);
	}

	return propDict;

}


export function inlineAsset(assetObj) {
	const result = assetObj.assetData;
	result._id = assetObj._id;
	result.label = assetObj.label;
	return result;
}
