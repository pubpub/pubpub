import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from './reducer';
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
