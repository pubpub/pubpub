import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const PUT_USER_LOAD = 'user/PUT_USER_LOAD';
export const PUT_USER_SUCCESS = 'user/PUT_USER_SUCCESS';
export const PUT_USER_FAIL = 'user/PUT_USER_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function putUser(userId, putUserData) {
	return (dispatch) => {
		dispatch({ type: PUT_USER_LOAD });
		return clientFetch('/api/user', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userId,
				email: putUserData.email,
				firstName: putUserData.firstName,
				lastName: putUserData.lastName,
				image: putUserData.image,
				bio: putUserData.bio,
				publicEmail: putUserData.publicEmail,
				website: putUserData.website,
				twitter: putUserData.twitter,
				orcid: putUserData.orcid,
				github: putUserData.github,
				googleScholar: putUserData.googleScholar,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_USER_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_USER_FAIL, error });
		});
	};
}
