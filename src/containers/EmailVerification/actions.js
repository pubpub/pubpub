/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const EMAIL_VERIFICATION_LOAD = 'login/EMAIL_VERIFICATION_LOAD';
export const EMAIL_VERIFICATION_SUCCESS = 'login/EMAIL_VERIFICATION_LOAD_SUCCESS';
export const EMAIL_VERIFICATION_FAIL = 'login/EMAIL_VERIFICATION_LOAD_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function checkEmailVerification(hash) {
	return {
		types: [EMAIL_VERIFICATION_LOAD, EMAIL_VERIFICATION_SUCCESS, EMAIL_VERIFICATION_FAIL],
		promise: (client) => client.post('/checkEmailVerification', {data: {
			hash: hash,
		}})
	};
}
