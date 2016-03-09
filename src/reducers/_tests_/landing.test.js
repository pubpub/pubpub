import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../landing';
// import {
// 	OPEN_MENU,
// } from '../../actions/landing';

describe('Reducers', () => {
	describe('landing.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
