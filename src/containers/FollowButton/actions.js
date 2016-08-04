/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const FOLLOW_LOAD = 'followButton/FOLLOW_LOAD';
export const FOLLOW_SUCCESS = 'followButton/FOLLOW_LOAD_SUCCESS';
export const FOLLOW_FAIL = 'followButton/FOLLOW_LOAD_FAIL';

export const UNFOLLOW_LOAD = 'followButton/UNFOLLOW_LOAD';
export const UNFOLLOW_SUCCESS = 'followButton/UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAIL = 'followButton/UNFOLLOW_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function follow(type, id) {
	return {
		types: [FOLLOW_LOAD, FOLLOW_SUCCESS, FOLLOW_FAIL],
		promise: (client) => client.post('/follow', {data: {
			type: type,
			id: id,
		}})
	};
}

export function unfollow(type, id) {
	return {
		types: [UNFOLLOW_LOAD, UNFOLLOW_SUCCESS, UNFOLLOW_FAIL],
		promise: (client) => client.post('/unfollow', {data: {
			type: type,
			id: id,
		}})
	};
}
