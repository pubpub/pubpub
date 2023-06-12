// @ts-check
const esModules = ['react-stylable-diff'].join('|');
const { pathsToModuleNameMapper } = require('ts-jest');
const requireJSON5 = require('require-json5');
const { compilerOptions } = requireJSON5('./tsconfig.json');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/client', '<rootDir>/facets'],
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: '<rootDir>/',
		}),
		'\\.[s]?css$': '<rootDir>/utils/storybook/styleMock.js',
		'@pubpub/deposit-utils/datacite':
			'<rootDir>/node_modules/@pubpub/deposit-utils/dist/cjs/datacite/index.js',
	},
	transform: {
		'^.+\\.[tj]sx?$': [
			'ts-jest',
			{
				diagnostics: false,
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globalSetup: '<rootDir>/stubstub/global/setup.ts',
	globalTeardown: '<rootDir>/stubstub/global/teardown.ts',
	setupFiles: ['<rootDir>/.jest/setup-env.js'],
	testPathIgnorePatterns: ['__tests__/data'],
};
