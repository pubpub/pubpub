import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../login';
// import {
// 	OPEN_MENU,
// } from '../../actions/login';

describe('Reducers', () => {
	describe('login.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
