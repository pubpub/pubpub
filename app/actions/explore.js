import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_ACTIVE_COMMUNITIES_LOAD = 'explore/GET_ACTIVE_COMMUNITIES_LOAD';
export const GET_ACTIVE_COMMUNITIES_SUCCESS = 'explore/GET_ACTIVE_COMMUNITIES_SUCCESS';
export const GET_ACTIVE_COMMUNITIES_FAIL = 'explore/GET_ACTIVE_COMMUNITIES_FAIL';

export const GET_ALL_COMMUNITIES_LOAD = 'explore/GET_ALL_COMMUNITIES_LOAD';
export const GET_ALL_COMMUNITIES_SUCCESS = 'explore/GET_ALL_COMMUNITIES_SUCCESS';
export const GET_ALL_COMMUNITIES_FAIL = 'explore/GET_ALL_COMMUNITIES_FAIL';
/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function getActiveCommunities() {
	return (dispatch) => {
		dispatch({ type: GET_ACTIVE_COMMUNITIES_LOAD });
		return apiFetch('/explore/activeCommunities')
		.then((result) => {
			dispatch({ type: GET_ACTIVE_COMMUNITIES_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_ACTIVE_COMMUNITIES_FAIL, error });
		});
	};
}

export function getAllCommunities() {
	return (dispatch) => {
		dispatch({ type: GET_ALL_COMMUNITIES_LOAD });
		return apiFetch('/explore/allCommunities')
		.then((result) => {
			dispatch({ type: GET_ALL_COMMUNITIES_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_ALL_COMMUNITIES_FAIL, error });
		});
	};
}