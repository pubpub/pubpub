/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD_PROFILE = 'user/LOAD_PROFILE';
export const LOAD_PROFILE_SUCCESS = 'user/LOAD_PROFILE_SUCCESS';
export const LOAD_PROFILE_FAIL = 'user/LOAD_PROFILE_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getProfile(username) {
	return {
		types: [LOAD_PROFILE, LOAD_PROFILE_SUCCESS, LOAD_PROFILE_FAIL],
		promise: (client) => client.get('/getUser', {params: {username: username}}) 
	};
}
