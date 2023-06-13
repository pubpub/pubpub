// @ts-check
const Sequencer = require('@jest/test-sequencer').default;

/**
 * This sequencer is soleley to force the `customScript` test to run first, as it creates the `customScripts` featureflag, which
 * is required by router tests
 */
class CustomSequencer extends Sequencer {
	/**
	 * Sort test to determine order of execution
	 * Sorting is applied after sharding
	 */
	sort(tests) {
		// Test structure information
		// https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
		const copyTests = Array.from(tests);
		return copyTests.sort((testA) => {
			if (testA.path.includes('customScript')) {
				return -1000;
			}

			return 0;
		});
	}
}

module.exports = CustomSequencer;
