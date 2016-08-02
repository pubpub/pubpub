/**
 * Created by joel on 8/1/16.
 */

const providers = [
	{
		name: 'codepen',
		test: /^https?:\/\/codepen\.io\/[^\/]+\/pen\/[^\/]+$/,
		api: 'http://codepen.io/api/oembed'
	},
	{
		name: 'youtube',
		test: /^https?:\/\/www\.youtube.com\/watch\?v=[^\/]+$/,
		api: 'http://youtube.com/oembed'
	},
	{
		name: 'vimeo',
		test: /^https?:\/\/vimeo\.com\/(([^\/]+)|((album|channels|groups|ondemand).+)|(.+\/.+\/video\/[^\/]+))$/,
		api: 'http://vimeo.com/api/oembed.json'
	},
	{
		name: 'jsbin',
		test: /^https?:\/\/jsbin\.com\/.+$/,
		api: 'http://jsbin.com/oembed'
	}
];

function match(url) {
	const matches = providers.filter(source => source.test.test(url));
	return matches[0] || false;
}

export {providers, match};