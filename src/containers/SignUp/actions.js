import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import analytics from 'utils/analytics';

 /*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const SIGNUP_LOAD = 'signup/SIGNUP_LOAD';
export const SIGNUP_SUCCESS = 'signup/SIGNUP_SUCCESS';
export const SIGNUP_FAIL = 'signup/SIGNUP_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function signup(email, password, firstName, lastName, image) {
	const analyticsData = {
		email: email,
		image: image,
		firstName: firstName,
		lastName: lastName,
	};
	analytics.sendEvent('Register', analyticsData);

	return {
		types: [SIGNUP_LOAD, SIGNUP_SUCCESS, SIGNUP_FAIL],
		promise: (client) => client.post('/register', {data: {
			'email': email.toLowerCase(),
			'password': SHA3(password).toString(encHex),
			'firstName': firstName,
			'lastName': lastName,
			'fullname': firstName + ' ' + lastName,
			'image': image
		}})
	};
}
