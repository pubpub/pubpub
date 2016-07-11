import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from './reducer';


describe('Reducers', () => {
	describe('jrnl.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

	});
});
