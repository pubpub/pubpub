/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOAD_PROFILE = 'user/LOAD_PROFILE';
export const LOAD_PROFILE_SUCCESS = 'user/LOAD_PROFILE_SUCCESS';
export const LOAD_PROFILE_FAIL = 'user/LOAD_PROFILE_FAIL';

export const UPDATE_USER = 'user/UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'user/UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'user/UPDATE_USER_FAIL';

export const USER_NAV_OUT = 'user/USER_NAV_OUT';
export const USER_NAV_IN = 'user/USER_NAV_IN';


export const INVITE_USER = 'user/INVITE';
export const INVITE_USER_SUCCESS = 'user/INVITE_SUCCESS';
export const INVITE_USER_FAIL = 'user/INVITE_FAIL';

export const SET_NOTIFICATIONS_READ_LOAD = 'user/SET_NOTIFICATIONS_READ_LOAD';
export const SET_NOTIFICATIONS_READ_SUCCESS = 'user/SET_NOTIFICATIONS_READ_SUCCESS';
export const SET_NOTIFICATIONS_READ_FAIL = 'user/SET_NOTIFICATIONS_READ_FAIL';


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

export function updateUser(newDetails) {
	return {
		types: [UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL],
		promise: (client) => client.post('/updateUser', {data: {newDetails: newDetails}})
	};
}

export function userNavOut() {
	return {
		type: USER_NAV_OUT,
	};
}

export function userNavIn() {
	return {
		type: USER_NAV_IN,
	};
}


export function inviteReviewers(pubID, inviteData) {
	return {
		types: [INVITE_USER, INVITE_USER_SUCCESS, INVITE_USER_FAIL],
		promise: (client) => client.post('/inviteReviewers', {data: {pubID: pubID, inviteData: inviteData}})
	};
}

export function setNotificationsRead(userID) {
	return {
		types: [SET_NOTIFICATIONS_READ_LOAD, SET_NOTIFICATIONS_READ_SUCCESS, SET_NOTIFICATIONS_READ_FAIL],
		promise: (client) => client.post('/setNotificationsRead', {data: {userID: userID}})
	};
}
