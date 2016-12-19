/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_FOLLOW_LOAD = 'follow/POST_FOLLOW_LOAD';
export const POST_FOLLOW_SUCCESS = 'follow/POST_FOLLOW_SUCCESS';
export const POST_FOLLOW_FAIL = 'follow/POST_FOLLOW_FAIL';

export const PUT_FOLLOW_LOAD = 'follow/PUT_FOLLOW_LOAD';
export const PUT_FOLLOW_SUCCESS = 'follow/PUT_FOLLOW_SUCCESS';
export const PUT_FOLLOW_FAIL = 'follow/PUT_FOLLOW_FAIL';

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
		dispatch({ type: POST_FOLLOW_LOAD });

		return clientFetch('/api/labels?title=' + query, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: POST_FOLLOW_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_FOLLOW_FAIL, error });
		});
	};
}
