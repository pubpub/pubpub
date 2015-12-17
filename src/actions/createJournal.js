/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_JOURNAL_LOAD = 'createJournal/CREATE_JOURNAL_LOAD';
export const CREATE_JOURNAL_SUCCESS = 'createJournal/CREATE_JOURNAL_LOAD_SUCCESS';
export const CREATE_JOURNAL_FAIL = 'createJournal/CREATE_JOURNAL_LOAD_FAIL';


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
		}}),
		journalName: journalName,
	};
}
