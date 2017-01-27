import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOGIN_POST_LOAD = 'login/LOGIN_POST_LOAD';
export const LOGIN_POST_SUCCESS = 'login/LOGIN_POST_SUCCESS';
export const LOGIN_POST_FAIL = 'login/LOGIN_POST_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function login(email, password) {
	return (dispatch) => {
		dispatch({ type: LOGIN_POST_LOAD });

		return clientFetch('/api/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: SHA3(password).toString(encHex)
			})
		})
		.then((result) => {
			dispatch({ type: LOGIN_POST_SUCCESS, result });
		})
		.catch((error) => {
			// console.log(error);
			dispatch({ type: LOGIN_POST_FAIL, error });
		});
	};
}
