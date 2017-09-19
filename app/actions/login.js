import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_LOGIN_LOAD = 'login/POST_LOGIN_LOAD';
export const POST_LOGIN_SUCCESS = 'login/POST_LOGIN_SUCCESS';
export const POST_LOGIN_FAIL = 'login/POST_LOGIN_FAIL';

export const GET_LOGOUT_LOAD = 'login/GET_LOGOUT_LOAD';
export const GET_LOGOUT_SUCCESS = 'login/GET_LOGOUT_SUCCESS';
export const GET_LOGOUT_FAIL = 'login/GET_LOGOUT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postLogin(email, password) {
	return (dispatch) => {
		dispatch({ type: POST_LOGIN_LOAD });
		return apiFetch('/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
			})
		})
		.then((result) => {
			dispatch({ type: POST_LOGIN_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_LOGIN_FAIL, error });
		});
	};
}

export function getLogout() {
	return (dispatch) => {
		dispatch({ type: GET_LOGOUT_LOAD });
		return apiFetch('/logout')
		.then((result) => {
			dispatch({ type: GET_LOGOUT_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_LOGOUT_FAIL, error });
		});
	};
}
