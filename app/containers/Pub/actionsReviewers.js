/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_REVIEWER_LOAD = 'pub/POST_REVIEWER_LOAD';
export const POST_REVIEWER_SUCCESS = 'pub/POST_REVIEWER_SUCCESS';
export const POST_REVIEWER_FAIL = 'pub/POST_REVIEWER_FAIL';

export const PUT_REVIEWER_LOAD = 'pub/PUT_REVIEWER_LOAD';
export const PUT_REVIEWER_SUCCESS = 'pub/PUT_REVIEWER_SUCCESS';
export const PUT_REVIEWER_FAIL = 'pub/PUT_REVIEWER_FAIL';

export const GET_USER_JOURNALS_LOAD = 'pub/GET_USER_JOURNALS_LOAD';
export const GET_USER_JOURNALS_SUCCESS = 'pub/GET_USER_JOURNALS_SUCCESS';
export const GET_USER_JOURNALS_FAIL = 'pub/GET_USER_JOURNALS_FAIL';

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

		return clientFetch('/api/pub/reviewer', {
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

export function putReviewer(pubId, invitedReviewerId, invitationAccepted, invitationRejected, rejectionReason) {
	return (dispatch) => {
		dispatch({ type: PUT_REVIEWER_LOAD });

		return clientFetch('/api/pub/reviewer', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				invitationAccepted: invitationAccepted,
				invitationRejected: invitationRejected,
				rejectionReason: rejectionReason,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_REVIEWER_SUCCESS, result, invitedReviewerId: invitedReviewerId, invitationAccepted: invitationAccepted, invitationRejected: invitationRejected, rejectionReason: rejectionReason });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_REVIEWER_FAIL, error });
		});
	};
}

export function getUserJournals(userId) {
	return (dispatch) => {
		dispatch({ type: GET_USER_JOURNALS_LOAD });
		return clientFetch(`/api/user/journals?userId=${userId}`)
		.then((result) => {
			dispatch({ type: GET_USER_JOURNALS_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_USER_JOURNALS_FAIL, error });
		});
	};
}
