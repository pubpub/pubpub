/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_PUB_LABEL_LOAD = 'pub/POST_PUB_LABEL_LOAD';
export const POST_PUB_LABEL_SUCCESS = 'pub/POST_PUB_LABEL_SUCCESS';
export const POST_PUB_LABEL_FAIL = 'pub/POST_PUB_LABEL_FAIL';

export const DELETE_PUB_LABEL_LOAD = 'pub/DELETE_PUB_LABEL_LOAD';
export const DELETE_PUB_LABEL_SUCCESS = 'pub/DELETE_PUB_LABEL_SUCCESS';
export const DELETE_PUB_LABEL_FAIL = 'pub/DELETE_PUB_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postPubLabel(pubId, labelId) {
	return (dispatch) => {
		dispatch({ type: POST_PUB_LABEL_LOAD });

		return clientFetch('/api/pub/label', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				labelId: labelId
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

export function deletePubLabel(pubId, labelId) {
	return (dispatch) => {
		dispatch({ type: DELETE_PUB_LABEL_LOAD });

		return clientFetch('/api/pub/label', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				labelId: labelId
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

