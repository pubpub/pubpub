import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from './reducer';
import {
	LOAD_APP_AND_LOGIN_LOAD,
	LOAD_APP_AND_LOGIN_SUCCESS,
	LOAD_APP_AND_LOGIN_FAIL,
} from './actions';

describe('Reducers', () => {
	describe('app.js', () => {

		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		it('should handle LOAD_APP_AND_LOGIN_LOAD', () => {
			const action = {
				type: LOAD_APP_AND_LOGIN_LOAD,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('loadAttempted')).to.be.true;
		});

		it('should handle LOAD_APP_AND_LOGIN_SUCCESS', () => {
			const action = {
				type: LOAD_APP_AND_LOGIN_SUCCESS,
				result: {
					languageData: {
						locale: 'fakeLocale',
						languageObject: 'fakeLanguageObject'
					}
				}
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('locale')).to.equal('fakeLocale');
			expect(newState.get('languageObject')).to.equal('fakeLanguageObject');
		});

		it('should handle LOAD_APP_AND_LOGIN_FAIL', () => {
			const action = {
				type: LOAD_APP_AND_LOGIN_FAIL,
				error: 'fakeError'
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('error')).to.equal('fakeError');
		});

	});
});
