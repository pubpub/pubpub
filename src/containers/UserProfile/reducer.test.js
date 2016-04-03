import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../user';
// import {
// 	OPEN_MENU,
// } from '../../actions/user';

describe('Reducers', () => {
	describe('user.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
