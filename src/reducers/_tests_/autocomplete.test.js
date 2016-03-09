import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../autocomplete';
// import {
// 	OPEN_MENU,
// } from '../../actions/autocomplete';

describe('Reducers', () => {
	describe('autocomplete.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
