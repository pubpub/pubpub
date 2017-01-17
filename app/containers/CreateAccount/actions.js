import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_SIGN_UP_DATA_LOAD = 'createAccount/GET_SIGN_UP_DATA_LOAD';
export const GET_SIGN_UP_DATA_SUCCESS = 'createAccount/GET_SIGN_UP_DATA_SUCCESS';
export const GET_SIGN_UP_DATA_FAIL = 'createAccount/GET_SIGN_UP_DATA_FAIL';

export const CREATE_ACCOUNT_LOAD = 'createAccount/CREATE_ACCOUNT_LOAD';
export const CREATE_ACCOUNT_SUCCESS = 'createAccount/CREATE_ACCOUNT_SUCCESS';
export const CREATE_ACCOUNT_FAIL = 'createAccount/CREATE_ACCOUNT_FAIL';

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

export function createAccount(createAccountData) {
	return (dispatch) => {
		dispatch({ type: CREATE_ACCOUNT_LOAD });

		return clientFetch('/api/user', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: createAccountData.email,
				hash: createAccountData.hash,
				username: createAccountData.username,
				firstName: createAccountData.firstName,
				lastName: createAccountData.lastName,
				password: SHA3(createAccountData.password).toString(encHex),
				avatar: createAccountData.avatar,
				bio: createAccountData.bio,
				publicEmail: createAccountData.publicEmail,
				website: createAccountData.website,
				twitter: createAccountData.twitter,
				orcid: createAccountData.orcid,
				github: createAccountData.github,
				googleScholar: createAccountData.googleScholar,
			})
		})
		.then((result) => {
			dispatch({ type: CREATE_ACCOUNT_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: CREATE_ACCOUNT_FAIL, error });
		});
	};
}
