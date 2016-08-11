/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOAD_APP_AND_LOGIN_LOAD = 'app/LOAD_APP_AND_LOGIN_LOAD';
export const LOAD_APP_AND_LOGIN_SUCCESS = 'app/LOAD_APP_AND_LOGIN_SUCCESS';
export const LOAD_APP_AND_LOGIN_FAIL = 'app/LOAD_APP_AND_LOGIN_FAIL';

<<<<<<< Updated upstream
export const RESEND_VERIFICATION_EMAIL_LOAD = 'app/RESEND_VERIFICATION_EMAIL_LOAD';
export const RESEND_VERIFICATION_EMAIL_SUCCESS = 'app/RESEND_VERIFICATION_EMAIL_SUCCESS';
export const RESEND_VERIFICATION_EMAIL_FAIL = 'app/RESEND_VERIFICATION_EMAIL_FAIL';

export const UNSET_NOT_FOUND = 'app/UNSET_NOT_FOUND';

=======
>>>>>>> Stashed changes
/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function loadAppAndLogin() {
	return {
		types: [LOAD_APP_AND_LOGIN_LOAD, LOAD_APP_AND_LOGIN_SUCCESS, LOAD_APP_AND_LOGIN_FAIL],
		promise: (client) => client.get('/loadAppAndLogin', {})
	};
}
<<<<<<< Updated upstream

export function resendVerificationEmail() {
	// These actions are not caught by any reducing function. We assume the email is sent succesfully.
	return {
		types: [RESEND_VERIFICATION_EMAIL_LOAD, RESEND_VERIFICATION_EMAIL_SUCCESS, RESEND_VERIFICATION_EMAIL_FAIL],
		promise: (client) => client.post('/resendVerificationEmail', {})
	};
}

export function unsetNotFound() {
	return {
		type: UNSET_NOT_FOUND
	};
}
=======
>>>>>>> Stashed changes
