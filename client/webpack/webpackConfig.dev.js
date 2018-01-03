const { resolve } = require('path');
const { readdirSync } = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const extractSass = new ExtractTextPlugin({
	filename: '[name].css',
	allChunks: true,
});

const containerEntries = readdirSync(resolve(__dirname, '../containers')).filter((item)=> {
	if (item === '.DS_Store') { return false; }
	return true;
}).reduce((prev, curr)=> {
	return {
		...prev,
		[curr]: resolve(__dirname, `../containers/${curr}/${curr}`)
	};
}, {});

module.exports = {
	entry: {
		...containerEntries,
		baseStyle: resolve(__dirname, '../baseStyle.scss'),
		vendor: [
			resolve(__dirname, '../../static/objectEntriesPolyfill.js'),
			'raven-js',
			'@blueprintjs/core',
			'@blueprintjs/labs',
			'@pubpub/editor',
			'prosemirror-collab',
			'prosemirror-commands',
			'prosemirror-compress',
			'prosemirror-gapcursor',
			'prosemirror-history',
			'prosemirror-inputrules',
			'prosemirror-keymap',
			'prosemirror-model',
			'prosemirror-schema-list',
			'prosemirror-schema-table',
			'prosemirror-state',
			'prosemirror-transform',
			'prosemirror-view',
			'react',
			'react-dom',
			'react-addons-css-transition-group',
		]
	},
	resolve: {
		modules: [resolve(__dirname, '../'), 'node_modules']
	},
	devtool: '#eval',
	output: {
		filename: '[name].js',
		path: resolve(__dirname, '../../dist'),
		publicPath: '/',
	},
	stats: {
		colors: true,
		hash: false,
		assets: false,
		children: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [resolve(__dirname, '../')],
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [
						{ loader: 'css-loader', options: { minimize: false } },
						{ loader: 'sass-loader', options: { includePaths: [resolve(__dirname, '../')] } }
					],
				})
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)$/,
				use: [
					{ loader: 'file-loader', query: { name: 'fonts/[hash].[ext]', publicPath: '/dist/' } }
				]
			}
		],
	},
	plugins: [
		extractSass,
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			minChunks: Infinity,
		}),
		new ManifestPlugin({ publicPath: '/dist/' }),
	],
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
