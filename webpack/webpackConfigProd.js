const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractSass = new ExtractTextPlugin({
	filename: '[name].[contenthash].css',
	allChunks: true,
});

module.exports = {
	entry: {
		main: resolve(__dirname, '../app'),
		vendor: [
			'@blueprintjs/core',
			'@blueprintjs/labs',
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
			'react-code-splitting',
			'react-dom',
			'react-helmet',
			'react-redux',
			'react-router-dom',
			'redux',
			'redux-thunk',
		],
	},
	resolve: {
		modules: [resolve(__dirname, '../app'), 'node_modules']
	},
	devtool: '#source-map',
	output: {
		filename: '[name].[chunkhash].js',
		path: resolve(__dirname, '../dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [resolve(__dirname, '../app')],
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [
						{ loader: 'css-loader', options: { minimize: true } },
						{ loader: 'sass-loader', options: { includePaths: [resolve(__dirname, '../app')] } }
					],
				})
			},
			{
				test: /\.(woff|woff2)$/,
				use: [
					{ loader: 'url-loader', query: { name: 'fonts/[hash].[ext]', limit: 5000, mimetype: 'application/font-woff' } }
				]
			},
			{
				test: /\.(ttf|eot|svg)$/,
				use: [
					{ loader: 'file-loader', query: { name: 'fonts/[hash].[ext]' } }
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
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true,
				unused: true,
				dead_code: true,
			},
			sourceMap: true,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'pubpub',
			template: 'webpack/template.html',
		}),
		new SWPrecacheWebpackPlugin({
			cacheId: 'pubpub-cache',
			filename: 'service-worker.js', // This name is referenced in manageServiceWorker.js
			maximumFileSizeToCacheInBytes: 4194304,
			minify: true,
			navigateFallback: '/index.html',
			staticFileGlobs: [
				'static/**.*',
				'static/images/**.*',
				'static/icons/**.*',
				'static/fonts/**.*',
			],
			staticFileGlobsIgnorePatterns: [
				/rss\//
			],
			stripPrefix: 'static/',
			mergeStaticsConfig: true, // Merge webpacks static outputs with the globs described above.
			runtimeCaching: [{
				urlPattern: /^https:\/\/v4-api\.pubpub\.org\//,
				handler: 'networkFirst',
				networkTimeoutSeconds: 5000,
				options: {
					cache: {
						maxEntries: 50,
						name: 'pubpub-v4-api-cache'
					}
				}
			}]
		}),
	],
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
