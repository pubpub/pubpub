import {expect} from 'chai';
import {Map} from 'immutable';
import reducer from './reducer';

import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,
} from './actions';

describe('Reducers', () => {
	describe('journalCreate.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});


	});
});
