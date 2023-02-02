/* global describe, it, expect */
import { createEmptyFacetInstance } from '..';
import { PubHeaderTheme } from '../../definitions';

describe('createEmptyFacetInstance', () => {
	it('creates an instance of a facet with all-null props', () => {
		expect(createEmptyFacetInstance(PubHeaderTheme)).toMatchInlineSnapshot();
	});
});
