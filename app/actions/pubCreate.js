import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_PUB_LOAD = 'pubCreate/POST_PUB_LOAD';
export const POST_PUB_SUCCESS = 'pubCreate/POST_PUB_SUCCESS';
export const POST_PUB_FAIL = 'pubCreate/POST_PUB_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createPub(collectionId, communityId) {
	return (dispatch) => {
		dispatch({ type: POST_PUB_LOAD });
		return apiFetch('/pubs', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				collectionId: collectionId,
				communityId: communityId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_PUB_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_PUB_FAIL, error });
		});
	};
}
