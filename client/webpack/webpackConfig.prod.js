const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const extractSass = new ExtractTextPlugin({
	filename: '[name].[contenthash].css',
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
		new ManifestPlugin(),
	],
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
