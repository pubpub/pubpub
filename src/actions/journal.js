/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_JOURNAL_LOAD = 'journal/CREATE_JOURNAL_LOAD';
export const CREATE_JOURNAL_SUCCESS = 'journal/CREATE_JOURNAL_LOAD_SUCCESS';
export const CREATE_JOURNAL_FAIL = 'journal/CREATE_JOURNAL_LOAD_FAIL';

export const LOAD_JOURNAL_AND_LOGIN = 'journal/LOAD_JOURNAL_AND_LOGIN';
export const LOAD_JOURNAL_AND_LOGIN_SUCCESS = 'journal/LOAD_JOURNAL_AND_LOGIN_SUCCESS';
export const LOAD_JOURNAL_AND_LOGIN_FAIL = 'journal/LOAD_JOURNAL_AND_LOGIN_FAIL';

export const LOAD_JOURNAL = 'journal/LOAD_JOURNAL';
export const LOAD_JOURNAL_SUCCESS = 'journal/LOAD_JOURNAL_SUCCESS';
export const LOAD_JOURNAL_FAIL = 'journal/LOAD_JOURNAL_FAIL';


/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function create(journalName, subdomain) {
	return {
		types: [CREATE_JOURNAL_LOAD, CREATE_JOURNAL_SUCCESS, CREATE_JOURNAL_FAIL],
		promise: (client) => client.post('/createJournal', {data: {
			'journalName': journalName,
			'subdomain': subdomain
		}})
	};
}

export function loadJournalAndLogin() {
	return {
		types: [LOAD_JOURNAL_AND_LOGIN, LOAD_JOURNAL_AND_LOGIN_SUCCESS, LOAD_JOURNAL_AND_LOGIN_FAIL],
		promise: (client) => client.get('/loadJournalAndLogin', {})
	};
}

export function getJournal(subdomain) {
	return {
		types: [LOAD_JOURNAL, LOAD_JOURNAL_SUCCESS, LOAD_JOURNAL_FAIL],
		promise: (client) => client.get('/getJournal', {params: {subdomain: subdomain}})
	};
}

