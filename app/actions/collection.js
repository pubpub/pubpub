import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_COLLECTION_DATA_LOAD = 'collection/GET_COLLECTION_DATA_LOAD';
export const GET_COLLECTION_DATA_SUCCESS = 'collection/GET_COLLECTION_DATA_SUCCESS';
export const GET_COLLECTION_DATA_FAIL = 'collection/GET_COLLECTION_DATA_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getCollectionData(collectionId) {
	return (dispatch) => {
		dispatch({ type: GET_COLLECTION_DATA_LOAD });
		return apiFetch(`/collections/${collectionId}`)
		.then((result) => {
			dispatch({ type: GET_COLLECTION_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_COLLECTION_DATA_FAIL, error });
		});
	};
}
