/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_LABEL_LOAD = 'search/GET_LABEL_LOAD';
export const GET_LABEL_SUCCESS = 'search/GET_LABEL_SUCCESS';
export const GET_LABEL_FAIL = 'search/GET_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getLabel(query) {
	const empty = null;
	return (dispatch) => {
		dispatch({ type: GET_LABEL_LOAD });

		return clientFetch('/api/label?title=' + query, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_LABEL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_LABEL_FAIL, error });
		});
	};
}
