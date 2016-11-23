/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_CONTRIBUTOR_LOAD = 'pub/POST_CONTRIBUTOR_LOAD';
export const POST_CONTRIBUTOR_SUCCESS = 'pub/POST_CONTRIBUTOR_SUCCESS';
export const POST_CONTRIBUTOR_FAIL = 'pub/POST_CONTRIBUTOR_FAIL';

export const PUT_CONTRIBUTOR_LOAD = 'pub/PUT_CONTRIBUTOR_LOAD';
export const PUT_CONTRIBUTOR_SUCCESS = 'pub/PUT_CONTRIBUTOR_SUCCESS';
export const PUT_CONTRIBUTOR_FAIL = 'pub/PUT_CONTRIBUTOR_FAIL';

export const DELETE_CONTRIBUTOR_LOAD = 'pub/DELETE_CONTRIBUTOR_LOAD';
export const DELETE_CONTRIBUTOR_SUCCESS = 'pub/DELETE_CONTRIBUTOR_SUCCESS';
export const DELETE_CONTRIBUTOR_FAIL = 'pub/DELETE_CONTRIBUTOR_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postContributor(userId, pubId) {
	return (dispatch) => {
		dispatch({ type: POST_CONTRIBUTOR_LOAD });

		return clientFetch('/api/pub/contributors', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userId,
				pubId: pubId
			})
		})
		.then((result) => {
			dispatch({ type: POST_CONTRIBUTOR_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_CONTRIBUTOR_FAIL, error });
		});
	};
}

export function putContributor(pubId, contributorId, canEdit, canRead, isAuthor, isHidden) {
	return (dispatch) => {
		dispatch({ type: PUT_CONTRIBUTOR_LOAD });

		return clientFetch('/api/pub/contributors', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				contributorId: contributorId, 
				canEdit: canEdit, 
				canRead: canRead, 
				isAuthor: isAuthor, 
				isHidden: isHidden
			})
		})
		.then((result) => {
			dispatch({ type: PUT_CONTRIBUTOR_SUCCESS, result, contributorId: contributorId, isAuthor: isAuthor });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_CONTRIBUTOR_FAIL, error });
		});
	};
}

export function deleteContributor(pubId, contributorId) {
	return (dispatch) => {
		dispatch({ type: DELETE_CONTRIBUTOR_LOAD });

		return clientFetch('/api/pub/contributors', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				contributorId: contributorId
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_CONTRIBUTOR_SUCCESS, result, deletedContributorId: contributorId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_CONTRIBUTOR_FAIL, error });
		});
	};
}

