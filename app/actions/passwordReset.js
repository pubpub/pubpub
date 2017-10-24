import { apiFetch } from 'utilities';
/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_PASSWORD_RESET_LOAD = 'passwordReset/GET_PASSWORD_RESET_LOAD';
export const GET_PASSWORD_RESET_SUCCESS = 'passwordReset/GET_PASSWORD_RESET_SUCCESS';
export const GET_PASSWORD_RESET_FAIL = 'passwordReset/GET_PASSWORD_RESET_FAIL';

export const POST_PASSWORD_RESET_LOAD = 'passwordReset/POST_PASSWORD_RESET_LOAD';
export const POST_PASSWORD_RESET_SUCCESS = 'passwordReset/POST_PASSWORD_RESET_SUCCESS';
export const POST_PASSWORD_RESET_FAIL = 'passwordReset/POST_PASSWORD_RESET_FAIL';

export const PUT_PASSWORD_RESET_LOAD = 'passwordReset/PUT_PASSWORD_RESET_LOAD';
export const PUT_PASSWORD_RESET_SUCCESS = 'passwordReset/PUT_PASSWORD_RESET_SUCCESS';
export const PUT_PASSWORD_RESET_FAIL = 'passwordReset/PUT_PASSWORD_RESET_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function getPasswordReset(slug, resetHash) {
	return (dispatch) => {
		dispatch({ type: GET_PASSWORD_RESET_LOAD });

		return apiFetch(`/password-reset?resetHash=${resetHash}&slug=${slug}`)
		.then((result) => {
			dispatch({ type: GET_PASSWORD_RESET_SUCCESS, result });
		})
		.catch((err) => {
			dispatch({ type: GET_PASSWORD_RESET_FAIL, err });
		});
	};
}

export function postPasswordReset(email) {
	return (dispatch) => {
		dispatch({ type: POST_PASSWORD_RESET_LOAD });
		return apiFetch('/password-reset', {
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
			dispatch({ type: POST_PASSWORD_RESET_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_PASSWORD_RESET_FAIL, error });
		});
	};
}

export function putPasswordReset(password, slug, hash) {
	return (dispatch) => {
		dispatch({ type: PUT_PASSWORD_RESET_LOAD });

		return apiFetch('/password-reset', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: password,
				slug: slug,
				resetHash: hash
			})
		})
		.then((result) => {
			dispatch({ type: PUT_PASSWORD_RESET_SUCCESS, result });
		})
		.catch((err) => {
			dispatch({ type: PUT_PASSWORD_RESET_FAIL, err });
		});
	};
}
