import {Asset} from '../../models/asset-model.js'

function oldParsePlugin(str) {
	const propDict = {};
	const pluginType = str.split(':')[0];
	propDict.pluginType = pluginType;

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



function refactorMarkdown({markdown, assets}) {

	const pluginRegex = /\[\[(.*?)\]\]/g;

	const processMatch = function(match, p1) {
		let pluginDict;
		try {
			pluginDict = JSON.parse(p1);
		} catch (err) {
			try {
				pluginDict = oldParsePlugin(p1);
			} catch (err) {
				console.log(err);
				return match;
			}
		}

		if (pluginDict.source && (typeof pluginDict.source === 'string' || pluginDict.source instanceof String)) {
			const asset = assets.find((asset) => (asset.label === pluginDict.source));
			if (asset) {
				pluginDict.source = asset;
			}
		}

		if (pluginDict.reference && (typeof pluginDict.reference === 'string' || pluginDict.reference instanceof String)) {
			const asset = assets.find((asset) => (asset.label === pluginDict.reference));
			if (asset) {
				pluginDict.reference = asset;
			}
		}

		const newString = JSON.stringify(pluginDict);
		// console.log(newString);
		return `[[${newString}]]`;

	};


	const newMarkdown = markdown.replace(pluginRegex, processMatch);
	return newMarkdown;
}

export default function widgetProcessor({pub, markdown, assets}) {
	const newMarkdown = refactorMarkdown({markdown, assets});
	return newMarkdown;
}
