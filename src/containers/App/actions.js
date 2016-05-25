/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOAD_APP_AND_LOGIN_LOAD = 'journal/LOAD_APP_AND_LOGIN_LOAD';
export const LOAD_APP_AND_LOGIN_SUCCESS = 'journal/LOAD_APP_AND_LOGIN_SUCCESS';
export const LOAD_APP_AND_LOGIN_FAIL = 'journal/LOAD_APP_AND_LOGIN_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function loadAppAndLogin() {
	return {
		types: [LOAD_APP_AND_LOGIN_LOAD, LOAD_APP_AND_LOGIN_SUCCESS, LOAD_APP_AND_LOGIN_FAIL],
		promise: (client) => client.get('/loadAppAndLogin', {})
	};
}
