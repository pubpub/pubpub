/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_APP_DATA_LOAD,
	GET_APP_DATA_SUCCESS,
	GET_APP_DATA_FAIL,
} from 'actions/app';

import {
	POST_LOGIN_LOAD,
	POST_LOGIN_SUCCESS,
	POST_LOGIN_FAIL,

	GET_LOGOUT_LOAD,
	GET_LOGOUT_SUCCESS,
	GET_LOGOUT_FAIL,
} from 'actions/login';

import {
	POST_USER_LOAD,
	POST_USER_SUCCESS,
	POST_USER_FAIL,
} from 'actions/userCreate';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_APP_DATA_LOAD:
	case GET_APP_DATA_FAIL:
		return state;
	case GET_APP_DATA_SUCCESS:
		return {
			data: action.result.loginData,
			isLoading: false,
			error: undefined,
		};
	case POST_USER_LOAD:
	case POST_USER_FAIL:
		return state;
	case POST_USER_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_LOGIN_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined,
		};
	case POST_LOGIN_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_LOGIN_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: 'Invalid Email or Password'
		};
	case GET_LOGOUT_LOAD:
	case GET_LOGOUT_FAIL:
		return state;
	case GET_LOGOUT_SUCCESS:
		return defaultState;
	default:
		return state;
	}
}
