const path = require('path');

module.exports = {
	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader'],
				include: path.resolve(__dirname, '../')
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
				include: path.resolve(__dirname, '../')
			},
			{ test: /\.svg$/, loader: 'file-loader', include: path.resolve(__dirname, '../') },
			{ test: /\.svg$/, loader: 'file-loader', include: path.resolve(__dirname, '../') },
			{ test: /\.png$/, loader: 'file-loader', include: path.resolve(__dirname, '../') },
			{ test: /\.jpg$/, loader: 'file-loader', include: path.resolve(__dirname, '../') },
			{ test: /\.json$/, loader: 'json-loader', include: path.resolve(__dirname, '../../') },
			{ test: /\.html$/, loader: 'html', include: path.resolve(__dirname, '../') },
      { test: /\.gif$/, loader: 'file-loader' },
			{ test: /\.(woff|woff2)$/, loader: 'url-loader', include: path.resolve(__dirname, '../'), options: { name: 'fonts/[hash].[ext]', limit: 5000, mimetype: 'application/font-woff' } },
			{ test: /\.(ttf|eot|svg)$/, loader: 'file-loader', options: { name: 'fonts/[hash].[ext]' } }
		]
	},
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	}
};
