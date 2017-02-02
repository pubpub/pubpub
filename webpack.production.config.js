/* eslint-disable strict */
'use strict';

const path = require('path');
const webpack = require('webpack');
const del = require('del');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlPluginRemove = require('html-webpack-plugin-remove');
const CopyWebpackPlugin = require('copy-webpack-plugin');

class CleanPlugin {
	constructor(options) {
		this.options = options;
	}

	apply() {
		del.sync(this.options.files);
	}
}

module.exports = {
	entry: './app/index',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.[hash].js',
		publicPath: '/'
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new CleanPlugin({
			files: ['dist/*']
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true
			}
		}),
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),
		new HtmlPluginRemove(/<script type="text\/javascript" src="\/app.js"><\/script>/),
		new CopyWebpackPlugin([
			{ from: 'static', to: 'static' },
			{ from: '_redirects' },
		])
	],
	module: {
		loaders: [
			{
				test: /\.js?/,
				loader: 'babel-loader',
				include: [
					path.join(__dirname, 'app'),
					path.join(__dirname, 'node_modules'),
				],
				exclude: /(node_modules\/(?!(pubpub-prose|pubpub-render-files)\/).*)|(.*citeproc.*)/,
				query: {
					plugins: [
						['transform-object-assign']
					]
				}
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.svg$/, loader: 'file-loader' },
			{ test: /\.png$/, loader: 'file-loader' },
			{ test: /\.gif$/, loader: 'file-loader' },
			{ test: /\.jpg$/, loader: 'file-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.html$/, loader: 'html-loader' },
			{ test: /\.(woff|woff2)$/, use: [{ loader: 'url-loader', query: { name: 'fonts/[hash].[ext]', limit: 5000, mimetype: 'application/font-woff' } }] },
			{ test: /\.(ttf|eot|svg)$/, use: [{ loader: 'file-loader', query: { name: 'fonts/[hash].[ext]' } }] }
		]
	},
	resolve: {
		modules: [path.resolve('app'), 'node_modules'],
		extensions: ['.json', '.js', '.jsx'],
	}
};
