import {expect} from 'chai';
import {Map} from 'immutable';
import reducer from './reducer';

import {
	CREATE_JRNL_LOAD,
	CREATE_JRNL_SUCCESS,
	CREATE_JRNL_FAIL,
} from './actions';

describe('Reducers', () => {
	describe('jrnlCreate.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});


	});
});
