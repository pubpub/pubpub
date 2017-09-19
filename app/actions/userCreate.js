import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SIGNUP_DATA_LOAD = 'userCreate/GET_SIGNUP_DATA_LOAD';
export const GET_SIGNUP_DATA_SUCCESS = 'userCreate/GET_SIGNUP_DATA_SUCCESS';
export const GET_SIGNUP_DATA_FAIL = 'userCreate/GET_SIGNUP_DATA_FAIL';

export const POST_USER_LOAD = 'userCreate/POST_USER_LOAD';
export const POST_USER_SUCCESS = 'userCreate/POST_USER_SUCCESS';
export const POST_USER_FAIL = 'userCreate/POST_USER_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getSignupData(hash) {
	return (dispatch) => {
		dispatch({ type: GET_SIGNUP_DATA_LOAD });
		return apiFetch(`/signup/${hash}`)
		.then((result) => {
			dispatch({ type: GET_SIGNUP_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_SIGNUP_DATA_FAIL, error });
		});
	};
}

export function postUser(email, hash, firstName, lastName, password) {
	return (dispatch) => {
		dispatch({ type: POST_USER_LOAD });
		return apiFetch('/users', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				hash: hash,
				firstName: firstName,
				lastName: lastName,
				password: password,
			})
		})
		.then((result) => {
			dispatch({ type: POST_USER_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_USER_FAIL, error });
		});
	};
}
