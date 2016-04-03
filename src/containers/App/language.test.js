import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../language';
// import {
// 	OPEN_MENU,
// } from '../../actions/language';

describe('Reducers', () => {
	describe('language.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
