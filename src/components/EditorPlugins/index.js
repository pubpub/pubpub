import MathPlugin from './MathPlugin';
import ImagePlugin from './ImagePlugin';

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
