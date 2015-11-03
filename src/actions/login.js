import CryptoJS from 'crypto-js';

/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const TOGGLE_VISIBILITY = 'login/TOGGLE_VISIBILITY';
export const LOGIN_LOAD = 'login/LOGIN_LOAD';
export const LOGIN_LOAD_SUCCESS = 'login/LOGIN_LOAD_SUCCESS';
export const LOGIN_LOAD_FAIL = 'login/LOGIN_LOAD_FAIL';
export const RESTORE_LOGIN_LOAD = 'login/RESTORE_LOGIN_LOAD';
export const RESTORE_LOGIN_LOAD_SUCCESS = 'login/RESTORE_LOGIN_LOAD_SUCCESS';
export const RESTORE_LOGIN_LOAD_FAIL = 'login/RESTORE_LOGIN_LOAD_FAIL';
export const LOGOUT_LOAD = 'login/LOGOUT_LOAD';
export const LOGOUT_LOAD_SUCCESS = 'login/LOGOUT_LOAD_SUCCESS';
export const LOGOUT_LOAD_FAIL = 'login/LOGOUT_LOAD_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function toggleVisibility() {
	return {
		type: TOGGLE_VISIBILITY
	};
}

export function login(email, password) {
	return {
		types: [LOGIN_LOAD, LOGIN_LOAD_SUCCESS, LOGIN_LOAD_FAIL],
		promise: (client) => client.post('/login', {data: {
			'email': email,
			'password': CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex)
		}})
	};
}

export function restoreLogin() {
	return {
		types: [RESTORE_LOGIN_LOAD, RESTORE_LOGIN_LOAD_SUCCESS, RESTORE_LOGIN_LOAD_FAIL],
		promise: (client) => client.get('/login', {})
	};
}

export function logout() {
	return {
		types: [LOGOUT_LOAD, LOGOUT_LOAD_SUCCESS, LOGOUT_LOAD_FAIL],
		promise: (client) => client.get('/logout', {})
	};
}
