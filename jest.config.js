// @ts-check
const esModules = ['react-stylable-diff'].join('|');
const { pathsToModuleNameMapper } = require('ts-jest');
const requireJSON5 = require('require-json5');
const { compilerOptions } = requireJSON5('./tsconfig.json');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
	// preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/client', '<rootDir>/facets'],
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	moduleNameMapper: {
		// ...pathsToModuleNameMapper(compilerOptions.paths, {
		// 	prefix: '<rootDir>/',
		// }),
		'\\.[s]?css$': '<rootDir>/utils/storybook/styleMock.js',
		'@pubpub/deposit-utils/datacite':
			'<rootDir>/node_modules/@pubpub/deposit-utils/dist/cjs/datacite/index.js',
	},
	transform: {
		'\\.(j|t)sx?$': 'esbuild-runner/jest',
		// '\\.(j|t)sx?$': [
		// 	'esbuild-jest',
		// 	{
		// 		format: 'cjs',
		// 		target: 'es6'
		// 	},
		// ],
	},
	// transform: {
	// 	'^.+\\.[tj]sx?$': [
	// 		'ts-jest',
	// 		{
	// 			diagnostics: false,
	// 		},
	// 	],
	// },
	globalSetup: '<rootDir>/stubstub/global/setup.ts',
	globalTeardown: '<rootDir>/stubstub/global/teardown.ts',
	setupFiles: ['<rootDir>/.jest/setup-env.js'],
	// testMatch: ['<rootDir>/server/pubHistory/__tests__/api.test.ts'],
	// testMatch: ['<rootDir>/workers/utils/__tests__/searchUtils.test.ts'],
	testPathIgnorePatterns: ['__tests__/data'],
};
