import {expect} from 'chai';
import {Map} from 'immutable';
import reducer from './reducer';

import {
	LOGIN_LOAD,
	LOGIN_LOAD_SUCCESS,
	LOGIN_LOAD_FAIL,
	LOGOUT_LOAD_SUCCESS,
} from './actions';

import {
	LOAD_APP_AND_LOGIN_SUCCESS,
} from 'containers/App/actions';

describe('Reducers', () => {
	describe('login.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		it('should handle LOGIN_LOAD', () => {
			const action = {
				type: LOGIN_LOAD,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loading')).to.be.true;
		});

		it('should handle LOGIN_LOAD_SUCCESS', () => {
			const action = {
				type: LOGIN_LOAD_SUCCESS,
				result: {
					loginData: {
						username: 'fakeUser'
					}
				}
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.getIn(['userData', 'username'])).to.equal('fakeUser');
		});

		it('should handle LOGIN_LOAD_FAIL', () => {
			const action = {
				type: LOGIN_LOAD_FAIL,
				error: 'fakeError'
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('error')).to.exist;
		});

		it('should handle LOGOUT_LOAD_SUCCESS', () => {
			const action = {
				type: LOGOUT_LOAD_SUCCESS,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('userData')).to.be.empty;
			expect(newState.get('loggedIn')).to.be.false;
		});

		it('should handle LOAD_APP_AND_LOGIN_SUCCESS', () => {
			const action = {
				type: LOGIN_LOAD_SUCCESS,
				result: {
					loginData: {
						username: 'fakeUser'
					}
				}
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.getIn(['userData', 'username'])).to.equal('fakeUser');
		});

	});
});
