/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_REVIEWER_LOAD = 'pub/POST_REVIEWER_LOAD';
export const POST_REVIEWER_SUCCESS = 'pub/POST_REVIEWER_SUCCESS';
export const POST_REVIEWER_FAIL = 'pub/POST_REVIEWER_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postReviewer(email, name, pubId, invitedUserId, inviterJournalId) {
	return (dispatch) => {
		dispatch({ type: POST_REVIEWER_LOAD });

		return clientFetch('/api/pub/reviewers', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				name: name,
				pubId: pubId,
				invitedUserId: invitedUserId,
				inviterJournalId: inviterJournalId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_REVIEWER_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_REVIEWER_FAIL, error });
		});
	};
}
