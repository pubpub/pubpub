import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_PUB_REDIRECT_LOAD = 'redirect/GET_PUB_REDIRECT_LOAD';
export const GET_PUB_REDIRECT_SUCCESS = 'redirect/GET_PUB_REDIRECT_SUCCESS';
export const GET_PUB_REDIRECT_FAIL = 'redirect/GET_PUB_REDIRECT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function getPubRedirect(slug) {
	return (dispatch) => {
		dispatch({ type: GET_PUB_REDIRECT_LOAD });
		return apiFetch(`/redirect/pubs?slug=${slug}`)
		.then((result) => {
			dispatch({ type: GET_PUB_REDIRECT_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_PUB_REDIRECT_FAIL, error });
		});
	};
}
