/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_PUB_LABEL_LOAD = 'journal/POST_PUB_LABEL_LOAD';
export const POST_PUB_LABEL_SUCCESS = 'journal/POST_PUB_LABEL_SUCCESS';
export const POST_PUB_LABEL_FAIL = 'journal/POST_PUB_LABEL_FAIL';

export const DELETE_PUB_LABEL_LOAD = 'journal/DELETE_PUB_LABEL_LOAD';
export const DELETE_PUB_LABEL_SUCCESS = 'journal/DELETE_PUB_LABEL_SUCCESS';
export const DELETE_PUB_LABEL_FAIL = 'journal/DELETE_PUB_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postPubLabel(pubId, labelId, journalId) {
	return (dispatch) => {
		dispatch({ type: POST_PUB_LABEL_LOAD });

		return clientFetch('/api/journal/labels', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				labelId: labelId,
				journalId: journalId
			})
		})
		.then((result) => {
			dispatch({ type: POST_PUB_LABEL_SUCCESS, result, pubId: pubId, labelId: labelId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_PUB_LABEL_FAIL, error });
		});
	};
}

export function deletePubLabel(pubId, labelId, journalId) {
	return (dispatch) => {
		dispatch({ type: DELETE_PUB_LABEL_LOAD });

		return clientFetch('/api/journal/labels', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				labelId: labelId,
				journalId: journalId
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_PUB_LABEL_SUCCESS, result, pubId: pubId, labelId: labelId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_PUB_LABEL_FAIL, error });
		});
	};
}

