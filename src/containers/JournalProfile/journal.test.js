import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../journal';
// import {
// 	OPEN_MENU,
// } from '../../actions/journal';

describe('Reducers', () => {
	describe('journal.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
