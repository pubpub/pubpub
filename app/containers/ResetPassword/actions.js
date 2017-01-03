import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const RESET_PASSWORD_LOAD = 'resetPassword/RESET_PASSWORD_LOAD';
export const RESET_PASSWORD_SUCCESS = 'resetPassword/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL = 'resetPassword/RESET_PASSWORD_FAIL';

export const SET_PASSWORD_LOAD = 'resetPassword/SET_PASSWORD_LOAD';
export const SET_PASSWORD_SUCCESS = 'resetPassword/SET_PASSWORD_SUCCESS';
export const SET_PASSWORD_FAIL = 'resetPassword/SET_PASSWORD_FAIL';

export const CHECK_RESET_HASH_LOAD = 'resetPassword/CHECK_RESET_HASH_LOAD';
export const CHECK_RESET_HASH_SUCCESS = 'resetPassword/CHECK_RESET_HASH_SUCCESS';
export const CHECK_RESET_HASH_FAIL = 'resetPassword/CHECK_RESET_HASH_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function postResetRequest(email) {
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

export function checkResetHash(username, resetHash) {
	return (dispatch) => {
		dispatch({ type: CHECK_RESET_HASH_LOAD });

		return clientFetch('/api/user/password/reset?resetHash=' + resetHash + '&username=' + username, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then((result) => {

			dispatch({ type: CHECK_RESET_HASH_SUCCESS, result });
		})
		.catch((err) => {
			dispatch({ type: CHECK_RESET_HASH_FAIL, err });
		});
	};

}

export function postPassword(password, username, hash) {

	return (dispatch) => {
		dispatch({ type: SET_PASSWORD_LOAD });

		return clientFetch('/api/user/password', {
			method: 'POST', // Changed from POST. Make sure hte rest of this request is formed properly
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: SHA3(password).toString(encHex),
				username: username,
				resetHash: hash
			})
		})
		.then((result) => {
			dispatch({ type: SET_PASSWORD_SUCCESS, result });
		})
		.catch((err) => {
			dispatch({ type: SET_PASSWORD_FAIL, err });
		});
	};
}
