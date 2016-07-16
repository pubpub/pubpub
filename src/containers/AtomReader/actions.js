/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_ATOM_DATA_LOAD = 'atom/GET_ATOM_DATA_LOAD';
export const GET_ATOM_DATA_SUCCESS = 'atom/GET_ATOM_DATA_SUCCESS';
export const GET_ATOM_DATA_FAIL = 'atom/GET_ATOM_DATA_FAIL';

export const SUBMIT_ATOM_TO_JOURNAL_LOAD = 'atom/SUBMIT_ATOM_TO_JOURNAL_LOAD';
export const SUBMIT_ATOM_TO_JOURNAL_SUCCESS = 'atom/SUBMIT_ATOM_TO_JOURNAL_SUCCESS';
export const SUBMIT_ATOM_TO_JOURNAL_FAIL = 'atom/SUBMIT_ATOM_TO_JOURNAL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function getAtomData(slug, meta, version) {
	return {
		types: [GET_ATOM_DATA_LOAD, GET_ATOM_DATA_SUCCESS, GET_ATOM_DATA_FAIL],
		promise: (client) => client.get('/getAtomData', {params: {
			slug: slug,
			meta: meta,
			version: version,
		}})
	};
}

export function submitAtomToJournals(atomID, journalIDs) {
	return {
		types: [SUBMIT_ATOM_TO_JOURNAL_LOAD, SUBMIT_ATOM_TO_JOURNAL_SUCCESS, SUBMIT_ATOM_TO_JOURNAL_FAIL],
		promise: (client) => client.post('/submitAtomToJournals', {data: {
			atomID: atomID,
			journalIDs: journalIDs,
		}})
	};
}
