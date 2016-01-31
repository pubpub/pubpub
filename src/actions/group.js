import analytics from '../utils/analytics';
/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_GROUP_LOAD = 'group/CREATE_GROUP_LOAD';
export const CREATE_GROUP_SUCCESS = 'group/CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAIL = 'group/CREATE_GROUP_FAIL';


/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
// export function toggleVisibility() {
// 	return {
// 		type: TOGGLE_VISIBILITY
// 	};	
// }

// export function logout() {
// 	analytics.sendEvent('Logout');

// 	return {
// 		types: [LOGOUT_LOAD, LOGOUT_LOAD_SUCCESS, LOGOUT_LOAD_FAIL],
// 		promise: (client) => client.get('/logout', {})
// 	};
// }
