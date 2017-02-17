/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_LABEL_LOAD = 'journal/POST_LABEL_LOAD';
export const POST_LABEL_SUCCESS = 'journal/POST_LABEL_SUCCESS';
export const POST_LABEL_FAIL = 'journal/POST_LABEL_FAIL';

export const PUT_LABEL_LOAD = 'journal/PUT_LABEL_LOAD';
export const PUT_LABEL_SUCCESS = 'journal/PUT_LABEL_SUCCESS';
export const PUT_LABEL_FAIL = 'journal/PUT_LABEL_FAIL';

export const DELETE_LABEL_LOAD = 'journal/DELETE_LABEL_LOAD';
export const DELETE_LABEL_SUCCESS = 'journal/DELETE_LABEL_SUCCESS';
export const DELETE_LABEL_FAIL = 'journal/DELETE_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postLabel(journalId, title, description, isDisplayed, order) {
	return (dispatch) => {
		dispatch({ type: POST_LABEL_LOAD });

		return clientFetch('/api/label', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				title: title,
				description: description,
				isDisplayed: isDisplayed,
				order: order,
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

export function putLabel(journalId, labelId, labelUpdates) {
	return (dispatch) => {
		dispatch({ type: PUT_LABEL_LOAD });

		return clientFetch('/api/label', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				labelId: labelId,
				journalId: journalId,
				...labelUpdates
			})
		})
		.then((result) => {
			dispatch({ type: PUT_LABEL_SUCCESS, result, labelId: labelId, labelUpdates: labelUpdates });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_LABEL_FAIL, error });
		});
	};
}

export function deleteLabel(journalId, labelId) {
	return (dispatch) => {
		dispatch({ type: DELETE_LABEL_LOAD });

		return clientFetch('/api/label', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				labelId: labelId
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_LABEL_SUCCESS, result, journalId: journalId, labelId: labelId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_LABEL_FAIL, error });
		});
	};
}

