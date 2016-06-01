// import {expect} from 'chai';
// import {Map} from 'immutable';
// import reducer from './reducer';

// import {
// 	SIGNUP_LOAD,
// 	SIGNUP_SUCCESS,
// 	SIGNUP_FAIL,
// } from './actions';

// describe('Reducers', () => {
// 	describe('login.js', () => {

// 		it('should return a default state', () => {
// 			const newState = reducer(undefined, {});
// 			expect(newState).to.exist;
// 		});

// 		it('should handle SIGNUP_LOAD', () => {
// 			const action = {
// 				type: SIGNUP_LOAD,
// 			};

// 			const state = Map();
// 			const newState = reducer(state, action);

// 			expect(newState.get('loading')).to.be.true;
// 		});

// 		it('should handle SIGNUP_SUCCESS', () => {
// 			const action = {
// 				type: SIGNUP_SUCCESS,
// 				result: {
// 					loginData: {
// 						username: 'fakeUser'
// 					}
// 				}
// 			};

// 			const state = Map();
// 			const newState = reducer(state, action);

// 			expect(newState.getIn(['userData', 'username'])).to.equal('fakeUser');
// 		});

// 		it('should handle SIGNUP_FAIL', () => {
// 			const action = {
// 				type: SIGNUP_FAIL,
// 				error: 'fakeError'
// 			};

// 			const state = Map();
// 			const newState = reducer(state, action);

// 			expect(newState.get('error')).to.exist;
// 		});

// 	});
// });
