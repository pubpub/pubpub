import {expect} from 'chai';
import {Map} from 'immutable';
import reducer from './reducer';

import {
	SIGNUP_LOAD,
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,
	SIGNUP_DETAILS_LOAD,
	SIGNUP_DETAILS_SUCCESS,
	SIGNUP_DETAILS_FAIL,
} from './actions';

describe('Reducers', () => {
	describe('signup.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		it('should handle SIGNUP_LOAD', () => {
			const action = {
				type: SIGNUP_LOAD,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.true;
			expect(newState.get('currentStage')).to.equal('signup');
		});

		it('should handle SIGNUP_SUCCESS', () => {
			const action = {
				type: SIGNUP_SUCCESS,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.false;
			expect(newState.get('currentStage')).to.equal('details');
		});

		it('should handle SIGNUP_FAIL', () => {
			const action = {
				type: SIGNUP_FAIL,
				error: 'fakeError'
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.false;
			expect(newState.get('error')).to.exist;
		});

		it('should handle SIGNUP_DETAILS_LOAD', () => {
			const action = {
				type: SIGNUP_DETAILS_LOAD,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.true;
			expect(newState.get('currentStage')).to.equal('details');
		});

		it('should handle SIGNUP_DETAILS_SUCCESS', () => {
			const action = {
				type: SIGNUP_DETAILS_SUCCESS,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.false;
			expect(newState.get('currentStage')).to.equal('complete');
		});

		it('should handle SIGNUP_DETAILS_FAIL', () => {
			const action = {
				type: SIGNUP_DETAILS_FAIL,
				error: 'fakeError'
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.false;
			expect(newState.get('error')).to.exist;
		});


	});
});
