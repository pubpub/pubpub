require('babel-polyfill');

// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const assetsPath = path.resolve(__dirname, '../static/dist');
const host = (process.env.HOST || 'localhost');
const port = parseInt(process.env.PORT, 10) + 1 || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const babelrc = fs.readFileSync('./.babelrc');
let babelrcObject = {};

try {
	babelrcObject = JSON.parse(babelrc);
} catch (err) {
	console.error('==>     ERROR: Error parsing your .babelrc.');
	console.error(err);
}

const babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
let combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

const babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
let reactTransform = null;
for (let index = 0; index < babelLoaderQuery.plugins.length; ++index) {
	const plugin = babelLoaderQuery.plugins[index];
	if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
		reactTransform = plugin;
	}
}

if (!reactTransform) {
	reactTransform = ['react-transform', {transforms: []}];
	babelLoaderQuery.plugins.push(reactTransform);
}
// babelLoaderQuery.cacheDirectory = './.babelCache';

if (!reactTransform[1] || !reactTransform[1].transforms) {
	reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
	transform: 'react-transform-hmr',
	imports: ['react'],
	locals: ['module']
});

module.exports = {
	cache: true,
	devtool: 'cheap-module-eval-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': [
			'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
			'./src/client.js'
		]
	},
	output: {
		path: assetsPath,
		filename: '[name]-[hash].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: 'http://' + host + ':' + port + '/dist/'
	},
	module: {
		loaders: [
			// { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelLoaderQuery)},
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'happypack/loader?id=babel'},
			{ test: /\.json$/, loader: 'json-loader' }
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
		new HappyPack({
			id: 'babel',
			loaders: ['babel?' + JSON.stringify(babelLoaderQuery)],
			threads: 4
		}),
		// hot reload
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/webpack-stats\.json$/),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: true,
			__DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
		}),
		webpackIsomorphicToolsPlugin.development()
	]
};
