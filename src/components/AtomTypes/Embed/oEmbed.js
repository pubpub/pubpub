/**
 * Created by joel on 8/1/16.
 */

const providers = [
	{
		name: 'codepen',
		test: /https?:\/\/codepen\.io\/[^\/]+\/pen\/[^\/]+$/,
		api: 'http://codepen.io/api/oembed'
	},
	{
		name: 'youtube',
		test: /https?:\/\/www.youtube.com\/watch\?v=[^\/]+$/,
		api: 'http://youtube.com/oembed'
	}
];

function match(url) {
	const matches = providers.filter(source => source.test.test(url));
	return matches[0] || false;
}

export {providers, match};