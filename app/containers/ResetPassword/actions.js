/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const RESET_PASSWORD_LOAD = 'resetPassword/RESET_PASSWORD_LOAD';
export const RESET_PASSWORD_SUCCESS = 'resetPassword/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL = 'resetPassword/RESET_PASSWORD_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function submitResetRequest(email) {
	return (dispatch) => {
		dispatch({ type: RESET_PASSWORD_LOAD });
		return clientFetch('/api/user/password/reset', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
			})
		})
		.then((result) => {
			dispatch({ type: RESET_PASSWORD_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: RESET_PASSWORD_FAIL, error });
		});
	};
}
