require('babel-polyfill');

// Webpack config for creating the production bundle.
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const strip = require('strip-loader');

const relativeAssetsPath = '../static/dist';
const assetsPath = path.join(__dirname, relativeAssetsPath);

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const containerRegex = /.+\/containers\/[^\/]+\/((Atom)|(Editor)|(EmailVerification)|(GroupCreate)|(GroupProfile)|(JournalCreate)|(JournalProfile)|(JournalCreate)|(JournalProfile)|(Login)|(PubCreate)|(PubReader)|(ResetPassword)|(SignUp)|(UserProfile))\.jsx?$/;
const componentRegex = /.+\/components\/[^\/]+\/((AboutJournals)|(AboutPubs)|(AboutReviews))\.jsx?$/;

module.exports = {
	devtool: 'cheap-module-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': [
			'./src/client.js'
		]
	},
	output: {
		path: assetsPath,
		filename: '[name]-[chunkhash].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: [/node_modules/, componentRegex, containerRegex], loaders: [strip.loader('debug'), 'babel']},		
			{ test: /\.jsx?$/, exclude: /node_modules/, include: [componentRegex, containerRegex], loaders: ['../helpers/bundleLoader', strip.loader('debug'), 'babel']},
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
			{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
			{ test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
		]
	},
	progress: true,
	resolve: {
		root: path.resolve('src'),
		modulesDirectories: [
			'node_modules'
		],
		extensions: ['', '.json', '.js', '.jsx']
	},
	node: {
		fs: 'empty'
	},
	plugins: [
		new CleanPlugin([relativeAssetsPath]),

		// css files from the extract-text-plugin loader
		new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
		new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('production')
			},
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: false,
			__DEVTOOLS__: false
		}),

		// ignore dev config
		new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

		// optimizations
		// new webpack.optimize.DedupePlugin(), // This causes problems with async bundle loading and npm run build.
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),

		webpackIsomorphicToolsPlugin
	]
};
