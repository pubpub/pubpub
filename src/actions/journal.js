/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD_JOURNAL_AND_LOGIN = 'login/LOAD_JOURNAL_AND_LOGIN';
export const LOAD_JOURNAL_AND_LOGIN_SUCCESS = 'login/LOAD_JOURNAL_AND_LOGIN_SUCCESS';
export const LOAD_JOURNAL_AND_LOGIN_FAIL = 'login/LOAD_JOURNAL_AND_LOGIN_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function loadJournalAndLogin() {
	return {
		types: [LOAD_JOURNAL_AND_LOGIN, LOAD_JOURNAL_AND_LOGIN_SUCCESS, LOAD_JOURNAL_AND_LOGIN_FAIL],
		promise: (client) => client.get('/loadJournalAndLogin', {})
	};
}
