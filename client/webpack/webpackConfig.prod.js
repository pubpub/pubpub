const { resolve } = require('path');
const { readdirSync } = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractSass = new ExtractTextPlugin({
	filename: '[name].[contenthash].css',
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
	devtool: '#source-map',
	output: {
		filename: '[name].[chunkhash].js',
		path: resolve(__dirname, '../../dist'),
		publicPath: '/',
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
						{ loader: 'css-loader', options: { minimize: true } },
						{ loader: 'sass-loader', options: { includePaths: [resolve(__dirname, '../')] } }
					],
				})
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)$/,
				use: [
					{ loader: 'file-loader', query: { name: 'fonts/[hash].[ext]', publicPath: 'https://static.pubpub.org/dist/' } }
				]
			}
		],
	},
	plugins: [
		// new BundleAnalyzerPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		extractSass,
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			minChunks: Infinity,
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true,
				unused: true,
				dead_code: true,
			},
			output: {
				comments: false,
			},
			sourceMap: true,
		}),
		new ManifestPlugin({ publicPath: 'https://static.pubpub.org/dist/' }),
	],
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
