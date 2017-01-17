/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const PUT_JOURNAL_SUBMIT_LOAD = 'journal/PUT_JOURNAL_SUBMIT_LOAD';
export const PUT_JOURNAL_SUBMIT_SUCCESS = 'journal/PUT_JOURNAL_SUBMIT_SUCCESS';
export const PUT_JOURNAL_SUBMIT_FAIL = 'journal/PUT_JOURNAL_SUBMIT_FAIL';

export const POST_JOURNAL_FEATURE_LOAD = 'journal/POST_JOURNAL_FEATURE_LOAD';
export const POST_JOURNAL_FEATURE_SUCCESS = 'journal/POST_JOURNAL_FEATURE_SUCCESS';
export const POST_JOURNAL_FEATURE_FAIL = 'journal/POST_JOURNAL_FEATURE_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function putJournalSubmit(journalId, pubId) {

	return (dispatch) => {
		dispatch({ type: PUT_JOURNAL_SUBMIT_LOAD });

		return clientFetch('/api/journal/submit', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				pubId: pubId,
				isRejected: true,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_JOURNAL_SUBMIT_SUCCESS, result, pubId: pubId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_JOURNAL_SUBMIT_FAIL, error });
		});
	};
}

export function postJournalFeature(journalId, pubId) {

	return (dispatch) => {
		dispatch({ type: POST_JOURNAL_FEATURE_LOAD });

		return clientFetch('/api/journal/feature', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				pubId: pubId
			})
		})
		.then((result) => {
			dispatch({ type: POST_JOURNAL_FEATURE_SUCCESS, result, pubId: pubId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_JOURNAL_FEATURE_FAIL, error });
		});
	};
}
