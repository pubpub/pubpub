import analytics from 'utils/analytics';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const FOLLOW_LOAD = 'followButton/FOLLOW_LOAD';
export const FOLLOW_SUCCESS = 'followButton/FOLLOW_SUCCESS';
export const FOLLOW_FAIL = 'followButton/FOLLOW_FAIL';

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
export function follow(type, followID) {
	analytics.sendEvent('Follow: ' + type, {followID: followID});
	return {
		types: [FOLLOW_LOAD, FOLLOW_SUCCESS, FOLLOW_FAIL],
		promise: (client) => client.post('/follow', {data: {
			type: type,
			followID: followID,
		}})
	};
}

export function unfollow(type, followID) {
	analytics.sendEvent('Unfollow: ' + type, {followID: followID});
	return {
		types: [UNFOLLOW_LOAD, UNFOLLOW_SUCCESS, UNFOLLOW_FAIL],
		promise: (client) => client.post('/unfollow', {data: {
			type: type,
			followID: followID,
		}})
	};
}
