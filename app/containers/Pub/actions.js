/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_PUB_DATA_LOAD = 'pub/GET_PUB_DATA_LOAD';
export const GET_PUB_DATA_SUCCESS = 'pub/GET_PUB_DATA_SUCCESS';
export const GET_PUB_DATA_FAIL = 'pub/GET_PUB_DATA_FAIL';

export const PUT_PUB_DATA_LOAD = 'pub/PUT_PUB_DATA_LOAD';
export const PUT_PUB_DATA_SUCCESS = 'pub/PUT_PUB_DATA_SUCCESS';
export const PUT_PUB_DATA_FAIL = 'pub/PUT_PUB_DATA_FAIL';

export const DELETE_PUB_LOAD = 'pub/DELETE_PUB_LOAD';
export const DELETE_PUB_SUCCESS = 'pub/DELETE_PUB_SUCCESS';
export const DELETE_PUB_FAIL = 'pub/DELETE_PUB_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPubData(slug) {
	return (dispatch) => {
		dispatch({ type: GET_PUB_DATA_LOAD });

		return clientFetch('/api/pub/?slug=' + slug, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_PUB_DATA_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_PUB_DATA_FAIL, error });
		});
	};
}

export function updatePub(pubId, updateData) {
	return (dispatch) => {
		dispatch({ type: PUT_PUB_DATA_LOAD });

		return clientFetch('/api/pub', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				title: updateData.title,
				description: updateData.description,
				avatar: updateData.avatar,
				slug: updateData.slug,
				headerColor: updateData.headerColor,
				headerImage: updateData.headerImage,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_PUB_DATA_SUCCESS, result, updateData: updateData });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_PUB_DATA_FAIL, error });
		});
	};
}

export function deletePub(pubId) {
	return (dispatch) => {
		dispatch({ type: DELETE_PUB_LOAD });

		return clientFetch('/api/pub', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_PUB_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_PUB_FAIL, error });
		});
	};
}
