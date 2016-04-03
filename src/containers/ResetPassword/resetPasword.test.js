import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../resetPassword';
// import {
// 	OPEN_MENU,
// } from '../../actions/resetPassword';

describe('Reducers', () => {
	describe('resetPassword.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
