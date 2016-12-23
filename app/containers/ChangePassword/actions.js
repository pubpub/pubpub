import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/

export const CHANGE_PASSWORD_HASH_LOAD = 'resetPassword/CHANGE_PASSWORD_HASH_LOAD';
export const CHANGE_PASSWORD_HASH_SUCCESS = 'resetPassword/CHANGE_PASSWORD_HASH_LOAD_SUCCESS';
export const CHANGE_PASSWORD_HASH_FAIL = 'resetPassword/CHANGE_PASSWORD_HASH_LOAD_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function checkHash(hash, username) {
	console.log("check HASH")
	return (dispatch) => {
		dispatch({ type: CHANGE_PASSWORD_HASH_LOAD });

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
			dispatch({ type: CHANGE_PASSWORD_HASH_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: CHANGE_PASSWORD_HASH_FAIL, error });
		});
	};
}
//
// export function resetPassword(hash, username, password) {
// 	return (dispatch) => {
// 		dispatch({ type: CHANGE_PASSWORD_LOAD });
//
// 		return clientFetch('/api/checkResetHash', {
// 			method: 'POST',
// 			headers: {
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({
// 				resetHash: hash,
// 				username: username,
// 				password: SHA3(password).toString(encHex),
//
// 			})
// 		})
// 		.then((result) => {
// 			dispatch({ type: CHANGE_PASSWORD_SUCCESS, result });
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 			dispatch({ type: CHANGE_PASSWORD_FAIL, error });
// 		});
// 	};
// }
