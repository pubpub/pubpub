/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_USER_DATA_LOAD = 'user/GET_USER_DATA_LOAD';
export const GET_USER_DATA_SUCCESS = 'user/GET_USER_DATA_SUCCESS';
export const GET_USER_DATA_FAIL = 'user/GET_USER_DATA_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getUserData(username) {
	return (dispatch) => {
		dispatch({ type: GET_USER_DATA_LOAD });
		return clientFetch('/api/user?username=' + username, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_USER_DATA_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_USER_DATA_FAIL, error });
		});
	};
}
