const { resolve } = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
	const config = genDefaultConfig(baseConfig, env);

	config.module.rules.push(
		{
			test: /\.scss$/,
			use: [
				{ loader: 'style-loader' }, // creates style nodes from JS strings
				{ loader: 'css-loader' }, // translates CSS into CommonJS
				{ loader: 'sass-loader', options: { includePaths: [resolve(__dirname, '../client')] } } // compiles Sass to CSS
			]
		}
	);

	config.resolve.modules = [resolve(__dirname, '../client'), 'node_modules'];
	return config;
};
