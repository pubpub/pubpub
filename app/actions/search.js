import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SEARCH_RESULTS_LOAD = 'search/GET_SEARCH_RESULTS_LOAD';
export const GET_SEARCH_RESULTS_SUCCESS = 'search/GET_SEARCH_RESULTS_SUCCESS';
export const GET_SEARCH_RESULTS_FAIL = 'search/GET_SEARCH_RESULTS_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getSearch(query, communityId) {
	if (!query) {
		return (dispatch)=> {
			dispatch({ type: GET_SEARCH_RESULTS_SUCCESS, result: undefined });
		};
	}

	return (dispatch) => {
		dispatch({ type: GET_SEARCH_RESULTS_LOAD });
		return apiFetch(`/search/pubs?q=${query}&communityId={${communityId}}`)
		.then((result) => {
			dispatch({ type: GET_SEARCH_RESULTS_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_SEARCH_RESULTS_FAIL, error });
		});
	};
}
