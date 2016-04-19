export function parsePluginString(str) {
	let propDict;


	// Problems escaping, see: http://stackoverflow.com/questions/36436331
	const replacedStr = String(str).replace(/\n/g, '\\n')
	.replace(/\r/g, '\\r')
	.replace(/\t/g, '\\t')
	.replace(/\f/g, '\\f')
	.replace(/\\*#/g, '#')
	// .replace(/\\*l/g, '#')
	.replace(/\\*&/g, '&');
	// .replace(/\\*([^u\\])/g, function(match, p1) { return p1;});

	try {
		propDict = JSON.parse(replacedStr);
	} catch (err) {
		propDict = {};
		console.log('Could not parse JSON!');
		console.log(err);
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
