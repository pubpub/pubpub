require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
// var HappyPack = require('happypack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = parseInt(process.env.PORT) + 1 || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
	reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', {transforms: []}];
  babelLoaderQuery.plugins.push(reactTransform);
}
// babelLoaderQuery.cacheDirectory = true;

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
  devtool: 'inline-source-map',
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
			{ test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelLoaderQuery)]},
			// { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['happypack/loader?id=babel']},
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
		fs: "empty"
	},
	plugins: [
		// new HappyPack({
		// 	id: 'babel',
		// 	loaders: ['babel?' + JSON.stringify(babelLoaderQuery)]
		// }),
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