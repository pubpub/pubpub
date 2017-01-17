/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_JOURNAL_ADMIN_LOAD = 'journal/POST_JOURNAL_ADMIN_LOAD';
export const POST_JOURNAL_ADMIN_SUCCESS = 'journal/POST_JOURNAL_ADMIN_SUCCESS';
export const POST_JOURNAL_ADMIN_FAIL = 'journal/POST_JOURNAL_ADMIN_FAIL';

export const DELETE_JOURNAL_ADMIN_LOAD = 'journal/DELETE_JOURNAL_ADMIN_LOAD';
export const DELETE_JOURNAL_ADMIN_SUCCESS = 'journal/DELETE_JOURNAL_ADMIN_SUCCESS';
export const DELETE_JOURNAL_ADMIN_FAIL = 'journal/DELETE_JOURNAL_ADMIN_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function postJournalAdmin(journalId, userId) {

	return (dispatch) => {
		dispatch({ type: POST_JOURNAL_ADMIN_LOAD });

		return clientFetch('/api/journal/admin', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				userId: userId
			})
		})
		.then((result) => {
			dispatch({ type: POST_JOURNAL_ADMIN_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_JOURNAL_ADMIN_FAIL, error });
		});
	};
}

export function deleteJournalAdmin(journalId, journalAdminId) {

	return (dispatch) => {
		dispatch({ type: DELETE_JOURNAL_ADMIN_LOAD });

		return clientFetch('/api/journal/admin', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				journalAdminId: journalAdminId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_JOURNAL_ADMIN_SUCCESS, result, journalAdminId: journalAdminId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_JOURNAL_ADMIN_FAIL, error });
		});
	};
}