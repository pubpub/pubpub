/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_JOURNAL_DATA_LOAD = 'journal/GET_JOURNAL_DATA_LOAD';
export const GET_JOURNAL_DATA_SUCCESS = 'journal/GET_JOURNAL_DATA_SUCCESS';
export const GET_JOURNAL_DATA_FAIL = 'journal/GET_JOURNAL_DATA_FAIL';

export const PUT_JOURNAL_DATA_LOAD = 'journal/PUT_JOURNAL_DATA_LOAD';
export const PUT_JOURNAL_DATA_SUCCESS = 'journal/PUT_JOURNAL_DATA_SUCCESS';
export const PUT_JOURNAL_DATA_FAIL = 'journal/PUT_JOURNAL_DATA_FAIL';
/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getJournalData(slug) {
	return (dispatch) => {
		dispatch({ type: GET_JOURNAL_DATA_LOAD });

		return clientFetch('/api/journal?slug=' + slug, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_JOURNAL_DATA_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_JOURNAL_DATA_FAIL, error });
		});
	};
}

export function putJournal(journalId, newJournalData) {

	return (dispatch) => {
		dispatch({ type: PUT_JOURNAL_DATA_LOAD });

		return clientFetch('/api/journal', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				...newJournalData
			})
		})
		.then((result) => {
			dispatch({ type: PUT_JOURNAL_DATA_SUCCESS, result, journalId: journalId, newJournalData: newJournalData });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_JOURNAL_DATA_FAIL, error });
		});
	};
}
