import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_USER_LOAD = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const SAVE_SETTINGS_LOAD = 'user/SAVE_SETTINGS_LOAD';
export const SAVE_SETTINGS_SUCCESS = 'user/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAIL = 'user/SAVE_SETTINGS_FAIL';

export const CHANGE_PASSWORD_LOAD = 'user/CHANGE_PASSWORD_LOAD';
export const CHANGE_PASSWORD_SUCCESS = 'user/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'user/CHANGE_PASSWORD_FAIL';

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

export function saveUserSettings(settings) {
	return {
		types: [SAVE_SETTINGS_LOAD, SAVE_SETTINGS_SUCCESS, SAVE_SETTINGS_FAIL],
		promise: (client) => client.post('/saveUserSettings', {data: {settings: settings}})
	};
}

export function changePassword(settings, email) {
	return {
		types: [CHANGE_PASSWORD_LOAD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL],
		promise: (client) => client.post('/changePassword', {data: {
			'email': email.toLowerCase(),
			'password': SHA3(settings.password).toString(encHex),
			'newPassword': SHA3(settings.newPassword).toString(encHex),
			'conPassword': SHA3(settings.conPassword).toString(encHex)
		}})
	};
}
