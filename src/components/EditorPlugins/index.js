import MathPlugin from './MathPlugin';
import ImagePlugin from './ImagePlugin';

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
		rule: /^(?:\s)*(:{2})math(:{2})([^\n:]+?)(:{2})/,
		inline: true,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[3]);
		}
	},
	asset: {
		component: ImagePlugin,
		inline: true,
		rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		inlineFunc: function(cap, renderer, assets) {
			console.log(assets);
			const refName = cap[1];
			const asset = assets.find(asst => (asst.refName === refName));
			let url = null;
			if (asset && asset.assetType === 'image') {
				url = asset.url_s3;
			} else if (asset) {
				url = 'error:type';
			}
			return renderer(refName, {'url': url});
		}
	}
	/*
	asset: {
		component: ImagePlugin,
		inline: false,
		rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		capFunc: function(src, cap) {
			return { type: 'asset', text: cap[1] };
		},
		tokenFunc: function(token, renderer, assets) {
			const asset = assets.find(asst => (asst.refName === token.text));
			let url = null;
			if (asset) {
				url = asset.url_s3;
			}
			return renderer(token.text, {'url': url});
		}
	}
	*/
};

import {imageOptions} from './ImagePlugin';
export const pluginOptions = {
	image: imageOptions,
};

export const globalPluginOptions = {
	titles: {
		caption: 'caption',
		printFallbackImage: 'print fallback image',
	},
	defaults: {
		caption: '',
		printFallbackImage: '',
	},
	values: {
		caption: '',
		printFallbackImage: '',
	},
};
