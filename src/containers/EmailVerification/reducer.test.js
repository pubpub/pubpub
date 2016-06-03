import {expect} from 'chai';
import {Map} from 'immutable';
import reducer from './reducer';

import {
	EMAIL_VERIFICATION_SUCCESS,
} from './actions';

describe('Reducers', () => {
	describe('login.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		it('should handle EMAIL_VERIFICATION_SUCCESS', () => {
			const action = {
				type: EMAIL_VERIFICATION_SUCCESS,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('emailVerified')).to.be.true;
		});

	});
});
