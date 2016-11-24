/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SEARCH_LOAD = 'search/GET_SEARCH_LOAD';
export const GET_SEARCH_SUCCESS = 'search/GET_SEARCH_SUCCESS';
export const GET_SEARCH_FAIL = 'search/GET_SEARCH_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function search(query) {
	return (dispatch) => {
		dispatch({ type: GET_SEARCH_LOAD });

		return clientFetch('/api/search/pub?q=' + query, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_SEARCH_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_SEARCH_FAIL, error });
		});
	};
}
