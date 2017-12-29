const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const extractSass = new ExtractTextPlugin({
	filename: '[name].css',
	allChunks: true,
});

module.exports = {
	entry: {
		About: resolve(__dirname, '../containers/About/About'),
		Landing: resolve(__dirname, '../containers/Landing/Landing'),
		baseStyle: resolve(__dirname, '../baseStyle.scss'),
		vendor: [
			'@blueprintjs/core',
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
		extractSass,
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			minChunks: Infinity,
		}),
		new ManifestPlugin(),
	],
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
