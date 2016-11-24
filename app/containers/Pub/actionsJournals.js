/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_JOURNAL_SUBMIT_LOAD = 'pub/POST_JOURNAL_SUBMIT_LOAD';
export const POST_JOURNAL_SUBMIT_SUCCESS = 'pub/POST_JOURNAL_SUBMIT_SUCCESS';
export const POST_JOURNAL_SUBMIT_FAIL = 'pub/POST_JOURNAL_SUBMIT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postJournalSubmit(pubId, journalId) {
	return (dispatch) => {
		dispatch({ type: POST_JOURNAL_SUBMIT_LOAD });

		return clientFetch('/api/pub/submits', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				journalId: journalId, 
			})
		})
		.then((result) => {
			dispatch({ type: POST_JOURNAL_SUBMIT_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_JOURNAL_SUBMIT_FAIL, error });
		});
	};
}
