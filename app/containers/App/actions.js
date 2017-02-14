/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOGIN_GET_LOAD = 'app/LOGIN_GET_LOAD';
export const LOGIN_GET_SUCCESS = 'app/LOGIN_GET_SUCCESS';
export const LOGIN_GET_FAIL = 'app/LOGIN_GET_FAIL';

export const LOGOUT_LOAD = 'app/LOGOUT_LOAD';
export const LOGOUT_SUCCESS = 'app/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'app/LOGOUT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function login() {
	const isDev = window.location.hostname === 'www.funky.com' || window.location.hostname === 'localhost';
	let urlPrefix = '';
	if (window.isJournal && isDev) { urlPrefix = 'http://localhost:3000'; }
	if (window.isJournal && !isDev) { urlPrefix = 'https://www.pubpub.org'; }
	// If we're on a journal, we need to query login directly to pubpub.org 
	// so that cookies are included.

	return (dispatch) => {
		dispatch({ type: LOGIN_GET_LOAD });
		return clientFetch(urlPrefix + '/api/login')
		.then((result) => {
			dispatch({ type: LOGIN_GET_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: LOGIN_GET_FAIL, error });
		});
	};
}

export function logout(hash) {
	return (dispatch) => {
		dispatch({ type: LOGOUT_LOAD });

		return clientFetch('/api/logout', {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: LOGOUT_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: LOGOUT_FAIL, error });
		});
	};
}
