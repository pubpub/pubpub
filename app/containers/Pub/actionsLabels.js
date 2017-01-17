/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_LABEL_LOAD = 'pub/POST_LABEL_LOAD';
export const POST_LABEL_SUCCESS = 'pub/POST_LABEL_SUCCESS';
export const POST_LABEL_FAIL = 'pub/POST_LABEL_FAIL';

export const PUT_LABEL_LOAD = 'pub/PUT_LABEL_LOAD';
export const PUT_LABEL_SUCCESS = 'pub/PUT_LABEL_SUCCESS';
export const PUT_LABEL_FAIL = 'pub/PUT_LABEL_FAIL';

export const DELETE_LABEL_LOAD = 'pub/DELETE_LABEL_LOAD';
export const DELETE_LABEL_SUCCESS = 'pub/DELETE_LABEL_SUCCESS';
export const DELETE_LABEL_FAIL = 'pub/DELETE_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postLabel(pubId, title, color) {
	return (dispatch) => {
		dispatch({ type: POST_LABEL_LOAD });

		return clientFetch('/api/label', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				title: title,
				color: color
			})
		})
		.then((result) => {
			dispatch({ type: POST_LABEL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_LABEL_FAIL, error });
		});
	};
}

export function putLabel(pubId, labelId, title, color) {
	return (dispatch) => {
		dispatch({ type: PUT_LABEL_LOAD });

		return clientFetch('/api/label', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				labelId: labelId,
				title: title,
				color: color
			})
		})
		.then((result) => {
			dispatch({ type: PUT_LABEL_SUCCESS, result, labelId: labelId, title: title, color: color });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_LABEL_FAIL, error });
		});
	};
}

export function deleteLabel(pubId, labelId) {
	return (dispatch) => {
		dispatch({ type: DELETE_LABEL_LOAD });

		return clientFetch('/api/label', {
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
			dispatch({ type: DELETE_LABEL_SUCCESS, result, pubId: pubId, labelId: labelId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_LABEL_FAIL, error });
		});
	};
}

