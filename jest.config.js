module.exports = {
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/client', '<rootDir>/stories'],
	moduleNameMapper: {
		'\\.[s]?css$': '<rootDir>/stories/styleMock.js',
	},
	globalSetup: '<rootDir>/stubstub/global/setup.js',
	globalTeardown: '<rootDir>/stubstub/global/teardown.js',
	setupFiles: ['<rootDir>/.jest/register-context.js', '<rootDir>/.jest/setup-env.js'],
	testPathIgnorePatterns: ['<rootDir>/shared/crossref/__tests__/data'],
	transform: {
		'^.+\\.(js|jsx)$': require.resolve('./jest.babelTransform.js'),
	},
};
