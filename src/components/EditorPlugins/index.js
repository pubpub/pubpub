import MathPlugin 	from './MathPlugin';
import PagebreakPlugin 	from './PagebreakPlugin';
import LinebreakPlugin 	from './LinebreakPlugin';
import ImagePlugin 	from './ImagePlugin';
import CitePlugin 	from './CitePlugin';
import VideoPlugin 	from './VideoPlugin';
import QuotePlugin 	from './QuotePlugin';
import IframePlugin 	from './IframePlugin';
import SelectionPlugin 	from './SelectionPlugin';

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
	pagebreak: {
		component: PagebreakPlugin,
		rule: /^(?:\s)*(?:\{\{)pagebreak([^\n\}]*)(?:\}\})/,
		inline: true,
		autocomplete: false,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[1]);
		}
	},
	linebreak: {
		component: LinebreakPlugin,
		rule: /^(?:\s)*(?:\{\{)linebreak([^\n\}]*)(?:\}\})/,
		inline: true,
		autocomplete: false,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[1]);
		}
	},
	selection: {
		component: SelectionPlugin,
		rule: /^(?:\s)*(?:\{\{)selection([^\n\}]*)(?:\}\})/,
		inline: true,
		autocomplete: false,
		inlineFunc: function(cap, renderer, data) {
			try {
				const selectionIndex = parseInt(cap[1].replace(':', ''), 10) - 1;
				const selectionItem = data.selections[selectionIndex];
				if (!selectionItem) {
					return renderer(cap[1], {selectionItem: 'empty'});
				}
				return renderer(selectionItem._id, {selectionItem});
			} catch (err) {
				console.log('Error parsing selection: ' + err);
			}
			return renderer(cap[1], {selectionItem: 'empty'});
		}
	},
	image: {
		component: ImagePlugin,
		inline: true,
		autocomplete: true,
		// rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		rule: /^(?:\s)*(?:\{\{)image:([^\n\}]*)(?:\}\})/,
		inlineFunc: function(cap, renderer, data) {
			const assets = data.assets;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.src || propDict.source || 'none';
			const asset = assets[refName];

			if (Object.keys(propDict).length === 0) {
				propDict.error = 'empty';
			} else if (asset && asset.assetType === 'image') {
				propDict.url = asset.url_s3;
			} else if (asset) {
				propDict.error = 'type';
			}
			return renderer(refName, propDict);
		}
	},
	video: {
		component: VideoPlugin,
		inline: true,
		autocomplete: true,
		// rule: /^(?:\s)*(?::{2})asset(?::{2})([^\n:]+)(?::{2})/,
		rule: /^(?:\s)*(?:\{\{)video:([^\n\}]*)(?:\}\})/,
		inlineFunc: function(cap, renderer, data) {
			const assets = data.assets;
			const propDict = parsePluginString(cap[1]);

			// historical naming variations on the source property
			const refName = propDict.src || propDict.source || 'none';
			const asset = assets[refName];
			if (Object.keys(propDict).length === 0) {
				propDict.error = 'empty';
			} else if (asset && asset.assetType === 'video') {
				propDict.url = asset.url_s3;
			} else {
				propDict.error = 'type';
			}

			return renderer(refName, propDict);
		}
	},
	quote: {
		component: QuotePlugin,
		inline: true,
		autocomplete: true,
		rule: /^(?:\s)*(?:\{\{)quote:([^\n\}]*)(?:\}\})/,
		inlineFunc: function(cap, renderer, data) {
			const references = data.references;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.srcRef || propDict.reference || 'none';
			const ref = references[refName];

			if (Object.keys(propDict).length === 0) {
				propDict.error = 'empty';
			} else if (ref) {
				propDict.reference = ref;
			} else {
				propDict.error = 'type';
			}
			return renderer(refName, propDict);
		}
	},
	iframe: {
		component: IframePlugin,
		inline: true,
		autocomplete: true,
		rule: /^(?:\s)*(?:\{\{)iframe:([^\n\}]*)(?:\}\})/,
		inlineFunc: function(cap, renderer, data) {
			const references = data.references;
			const propDict = parsePluginString(cap[1]);
			const refName = propDict.srcRef || propDict.reference || 'none';
			const ref = references[refName];

			if (Object.keys(propDict).length === 0) {
				propDict.error = 'empty';
			} else if (ref) {
				propDict.reference = ref;
			} else {
				propDict.error = 'type';
			}
			return renderer(refName, propDict);
		}
	},
	cite: {
		component: CitePlugin,
		inline: true,
		autocomplete: true,
		rule: /^(?:\s)*(?:\{\{)cite:([^\n\}]*)(?:\}\})/,
		inlineFunc: function(cap, renderer, data) {
			const references = data.references;
			const propDict = parsePluginString(cap[1]);

			// historical naming variations on the source property
			const refName = propDict.srcRef || propDict.reference || 'none';
			const ref = references[refName];
			if (Object.keys(propDict).length === 0) {
				propDict.error = 'empty';
			} else if (ref) {
				propDict.count = ref.count;
				propDict.reference = ref;
			} else {
				propDict.error = 'type';
			}
			return renderer(refName, propDict);
		}
	}
};

import {imageOptions} from './ImagePlugin';
import {videoOptions} from './VideoPlugin';
import {citeOptions} from './CitePlugin';
import {quoteOptions} from './QuotePlugin';
import {iframeOptions} from './IframePlugin';

export const pluginOptions = {
	image: imageOptions,
	cite: citeOptions,
	video: videoOptions,
	quote: quoteOptions,
	iframe: iframeOptions
};
