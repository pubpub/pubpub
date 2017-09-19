import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_SIGNUP_LOAD = 'signup/POST_SIGNUP_LOAD';
export const POST_SIGNUP_SUCCESS = 'signup/POST_SIGNUP_SUCCESS';
export const POST_SIGNUP_FAIL = 'signup/POST_SIGNUP_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postSignup(email) {
	return (dispatch) => {
		dispatch({ type: POST_SIGNUP_LOAD });
		return apiFetch('/signup', {
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
			dispatch({ type: POST_SIGNUP_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_SIGNUP_FAIL, error });
		});
	};
}
