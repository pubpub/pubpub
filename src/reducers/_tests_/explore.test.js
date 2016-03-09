import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../explore';
// import {
// 	OPEN_MENU,
// } from '../../actions/explore';

describe('Reducers', () => {
	describe('explore.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
