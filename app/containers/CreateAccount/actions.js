/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SIGN_UP_DATA_LOAD = 'createAccount/GET_SIGN_UP_DATA_LOAD';
export const GET_SIGN_UP_DATA_SUCCESS = 'createAccount/GET_SIGN_UP_DATA_SUCCESS';
export const GET_SIGN_UP_DATA_FAIL = 'createAccount/GET_SIGN_UP_DATA_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getSignUpData(hash) {
	return (dispatch) => {
		dispatch({ type: GET_SIGN_UP_DATA_LOAD });

		return clientFetch('/api/signup?hash=' + hash, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_SIGN_UP_DATA_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_SIGN_UP_DATA_FAIL, error });
		});
	};
}
