import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../editor';
// import {
// 	OPEN_MENU,
// } from '../../actions/editor';

describe('Reducers', () => {
	describe('editor.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		// it('should handle OPEN_MENU', () => {

		// });

	});
});
