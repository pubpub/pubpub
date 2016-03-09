import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../pub';
// import {
// 	OPEN_MENU,
// } from '../../actions/pub';

describe('Reducers', () => {
	describe('pub.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
