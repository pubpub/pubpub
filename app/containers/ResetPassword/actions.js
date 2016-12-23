import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const RESET_PASSWORD_REQUEST_LOAD = 'resetPassword/RESET_PASSWORD_REQUEST_LOAD';
export const RESET_PASSWORD_REQUEST_SUCCESS = 'resetPassword/RESET_PASSWORD_REQUEST_LOAD_SUCCESS';
export const RESET_PASSWORD_REQUEST_FAIL = 'resetPassword/RESET_PASSWORD_REQUEST_LOAD_FAIL';

export const RESET_PASSWORD_HASH_LOAD = 'resetPassword/RESET_PASSWORD_HASH_LOAD';
export const RESET_PASSWORD_HASH_SUCCESS = 'resetPassword/RESET_PASSWORD_HASH_LOAD_SUCCESS';
export const RESET_PASSWORD_HASH_FAIL = 'resetPassword/RESET_PASSWORD_HASH_LOAD_FAIL';

export const RESET_PASSWORD_LOAD = 'resetPassword/RESET_PASSWORD_LOAD';
export const RESET_PASSWORD_SUCCESS = 'resetPassword/RESET_PASSWORD_LOAD_SUCCESS';
export const RESET_PASSWORD_FAIL = 'resetPassword/RESET_PASSWORD_LOAD_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function submitResetRequest(email) {
	console.log("submitResetRequest bro")
	return (dispatch) => {
		dispatch({ type: RESET_PASSWORD_REQUEST_LOAD });

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
			dispatch({ type: RESET_PASSWORD_REQUEST_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: RESET_PASSWORD_REQUEST_FAIL, error });
		});
	};
}

export function checkHash(hash, username) {
	return (dispatch) => {
		dispatch({ type: RESET_PASSWORD_HASH_LOAD });

		return clientFetch('/user/password/reset', {
			method: 'GET', // Changed from POST. Make sure hte rest of this request is formed properly
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resetHash: hash,
				username: username
			})
		})
		.then((result) => {
			dispatch({ type: RESET_PASSWORD_HASH_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: RESET_PASSWORD_HASH_FAIL, error });
		});
	};
}

export function resetPassword(hash, username, password) {
	return (dispatch) => {
		dispatch({ type: RESET_PASSWORD_LOAD });

		return clientFetch('/api/checkResetHash', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resetHash: hash,
				username: username,
				password: SHA3(password).toString(encHex),

			})
		})
		.then((result) => {
			dispatch({ type: RESET_PASSWORD_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: RESET_PASSWORD_FAIL, error });
		});
	};
}
