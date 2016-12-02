/* eslint-disable strict */
'use strict';

const path = require('path');
const webpack = require('webpack');
const del = require('del');

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
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true
			}
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			}
		})
	],
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				include: path.join(__dirname, 'app'),
				query: {
					plugins: [
						['transform-object-assign']
					]
				}
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.svg$/, loader: 'file-loader' },
			{ test: /\.png$/, loader: 'file-loader' },
			{ test: /\.jpg$/, loader: 'file-loader' },
			{ test: /\.json$/, loader: 'json-loader' }
		]
	},
	resolve: {
		modules: [path.resolve('app'), 'node_modules'],
		extensions: ['.json', '.js', '.jsx'],
	}
};
