const babelJest = require('babel-jest');

const transformer = babelJest.createTransformer({
	babelrc: false,
	configFile: require.resolve('./babel.config.js'),
});

module.exports = transformer;
