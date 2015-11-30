export function parsePluginString(str) {
	const propDict = {};
	const regex = /([^=\s]*)\s*=\s*(.*)/;
	for (const prop of str.split(',')) {
		const match = regex.exec(prop);
		propDict[match[1]] = match[2];
	}
	return propDict;
}
