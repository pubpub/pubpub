/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_USER_LOAD = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getUser(username) {
	return {
		types: [GET_USER_LOAD, GET_USER_SUCCESS, GET_USER_FAIL],
		promise: (client) => client.get('/getUser', {params: {username: username}})
	};
}
