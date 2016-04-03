import analytics from 'utils/analytics';
/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOAD_APP_AND_LOGIN_LOAD = 'journal/LOAD_APP_AND_LOGIN_LOAD';
export const LOAD_APP_AND_LOGIN_SUCCESS = 'journal/LOAD_APP_AND_LOGIN_SUCCESS';
export const LOAD_APP_AND_LOGIN_FAIL = 'journal/LOAD_APP_AND_LOGIN_FAIL';

export const OPEN_MENU = 'nav/OPEN_MENU';
export const CLOSE_MENU = 'nav/CLOSE_MENU';

export const GET_RANDOM_SLUG_LOAD = 'journal/GET_RANDOM_SLUG_LOAD';
export const GET_RANDOM_SLUG_SUCCESS = 'journal/GET_RANDOM_SLUG_SUCCESS';
export const GET_RANDOM_SLUG_FAIL = 'journal/GET_RANDOM_SLUG_FAIL';

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

export function openMenu() {
	return {
		type: OPEN_MENU,
	};
}

export function closeMenu() {
	return {
		type: CLOSE_MENU,
	};
}

export function getRandomSlug(journalID, analyticsData) {
	analytics.sendEvent('Random Pub', analyticsData);
	return {
		types: [GET_RANDOM_SLUG_LOAD, GET_RANDOM_SLUG_SUCCESS, GET_RANDOM_SLUG_FAIL],
		promise: (client) => client.get('/getRandomSlug', {params: {journalID: journalID}})
	};
}
