import MathPlugin from './MathPlugin';
import ImagePlugin from './ImagePlugin';
import {parsePluginString} from '../../utils/parsePlugins';
/* -----------------
Supported PubPub Syntax
-----------------
[title: My Pub Title] *required, only take first one
[abstract: Here is all of my stuff] *required, only take first one
[cite: myciteref]
[ref: my reference to a plugin]
$math$
::image:refName::
::video:refName::
::audio:refName::
::table:refName::
----------------- */

export default {
	math: {
		component: MathPlugin,
		rule: /^\$([^\$]+)\$/,
		inline: true,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[1]);
		}
	},
	image: {
		component: ImagePlugin,
		inline: true,
		// rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		rule: /^(?:\s)*(?:\[)image:([^\n\]]*)(?:\])/,
		inlineFunc: function(cap, renderer, assets) {
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.src || 'none';
			const asset = assets.find(asst => (asst.refName === refName));
			let url = null;
			if (asset && asset.assetType === 'image') {
				url = asset.url_s3;
			} else if (asset) {
				url = 'error:type';
			}
			propDict.url = url;
			return renderer(refName, propDict);
		}
	}
};

import {imageOptions} from './ImagePlugin';
export const pluginOptions = {
	image: imageOptions,
};

export const globalPluginOptions = {
	caption: {
		title: 'caption',
		default: '',
		value: '',
	},
	printFallbackImage: {
		title: 'print fallback image',
		default: '',
		value: '',
	}
};
