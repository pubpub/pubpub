import MathPlugin 	from './MathPlugin';
import ImagePlugin 	from './ImagePlugin';
import CitePlugin 	from './CitePlugin';
import VideoPlugin 	from './VideoPlugin';

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
		autocomplete: false,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[1]);
		}
	},
	image: {
		component: ImagePlugin,
		inline: true,
		autocomplete: true,
		// rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		rule: /^(?:\s)*(?:\[)image:([^\n\]]*)(?:\])/,
		inlineFunc: function(cap, renderer, data) {
			const assets = data.assets;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.src || 'none';
			// const asset = assets.find(asst => (asst.refName === refName));
			const asset = assets[refName];
			let url = null;
			if (asset && asset.assetType === 'image') {
				url = asset.url_s3;
			} else if (asset) {
				url = 'error:type';
			}
			propDict.url = url;
			return renderer(refName, propDict);
		}
	},
	video: {
		component: VideoPlugin,
		inline: true,
		autocomplete: true,
		// rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		rule: /^(?:\s)*(?:\[)video:([^\n\]]*)(?:\])/,
		inlineFunc: function(cap, renderer, data) {
			const assets = data.assets;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.src || 'none';
			// const asset = assets.find(asst => (asst.refName === refName));
			const asset = assets[refName];
			let url = null;
			if (asset && asset.assetType === 'video') {
				url = asset.url_s3;
			} else if (asset) {
				url = 'error:type';
			}
			propDict.url = url;

			return renderer(refName, propDict);
		}
	},
	cite: {
		component: CitePlugin,
		inline: true,
		autocomplete: true,
		rule: /^(?:\s)*(?:\[)cite:([^\n\]]*)(?:\])/,
		inlineFunc: function(cap, renderer, data) {
			const references = data.references;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.srcRef || 'none';
			const ref = references[refName];
			if (ref) {
				propDict.count = ref.count;
				propDict.reference = ref;
			} else {
				propDict.reference = 'error:type';
			}
			return renderer(refName, propDict);
		}
	}
};

import {imageOptions} from './ImagePlugin';
import {videoOptions} from './VideoPlugin';
import {citeOptions} from './CitePlugin';

export const pluginOptions = {
	image: imageOptions,
	cite: citeOptions,
	video: videoOptions,
};
