const path = require('path');

let genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

module.exports = function(config, env) {
  let extendedDefaultConfig = genDefaultConfig(config, env);

  extendedDefaultConfig.module.loaders.push({
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
  			{ test: /\.html$/, loader: 'html', include: path.resolve(__dirname, '../') },
        { test: /\.gif$/, loader: 'file-loader' },
  			{ test: /\.(woff|woff2)$/, loader: 'url-loader', include: path.resolve(__dirname, '../'), options: { name: 'fonts/[hash].[ext]', limit: 5000, mimetype: 'application/font-woff' } },
  			{ test: /\.(ttf|eot|svg)$/, loader: 'file-loader', options: { name: 'fonts/[hash].[ext]' } });

  extendedDefaultConfig.resolve.modules = [path.resolve('./app'), 'node_modules'];
  extendedDefaultConfig.resolve.modulesDirectories = [path.resolve('./app'), 'node_modules'];
  extendedDefaultConfig.node = {
  		net: 'empty',
  		tls: 'empty',
  		dns: 'empty',
  		fs: 'empty',
  };

  extendedDefaultConfig.module.loaders[0].test = /\.js?/;
  extendedDefaultConfig.module.loaders[0].include = [ '/Users/thariqshihipar/pubpub-v3/pubpub', '/Users/thariqshihipar/pubpub-v3/pubpub/app' ];
  extendedDefaultConfig.resolve.extensions = ['', '.json', '.js', '.jsx'];

  return extendedDefaultConfig;
};
