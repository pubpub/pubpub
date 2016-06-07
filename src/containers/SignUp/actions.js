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

export const SIGNUP_DETAILS_LOAD = 'signup/SIGNUP_DETAILS_LOAD';
export const SIGNUP_DETAILS_SUCCESS = 'signup/SIGNUP_DETAILS_SUCCESS';
export const SIGNUP_DETAILS_FAIL = 'signup/SIGNUP_DETAILS_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function signup(firstName, lastName, email, password) {
	const analyticsData = {
		firstName: firstName,
		lastName: lastName,
		email: email,
	};
	analytics.sendEvent('SignUp', analyticsData);

	return {
		types: [SIGNUP_LOAD, SIGNUP_SUCCESS, SIGNUP_FAIL],
		promise: (client) => client.post('/signup', {data: {
			'firstName': firstName,
			'lastName': lastName,
			'email': email.toLowerCase(),
			'password': SHA3(password).toString(encHex),
		}})
	};
}

export function signupDetails(image, bio, website, twitter, orcid, github, googleScholar) {
	const data = {
		image: image,
		bio: bio,
		website: website,
		twitter: twitter,
		orcid: orcid,
		github: github,
		googleScholar: googleScholar,
	};
	analytics.sendEvent('SignUpDetails', data);
	return {
		types: [SIGNUP_DETAILS_LOAD, SIGNUP_DETAILS_SUCCESS, SIGNUP_DETAILS_FAIL],
		promise: (client) => client.post('/signup-details', {data: data})
	};
}
