import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SIGN_UP_DATA_LOAD,
	GET_SIGN_UP_DATA_SUCCESS,
	GET_SIGN_UP_DATA_FAIL,

	CREATE_ACCOUNT_LOAD,
	CREATE_ACCOUNT_SUCCESS,
	CREATE_ACCOUNT_FAIL,

} from 'containers/CreateAccount/actions';

import {
	LOGIN_POST_LOAD,
	LOGIN_POST_SUCCESS,
	LOGIN_POST_FAIL,
} from 'containers/Login/actions';

import {
	LOGIN_GET_LOAD,
	LOGIN_GET_SUCCESS,
	LOGIN_GET_FAIL,

	LOGOUT_LOAD,
	LOGOUT_SUCCESS,
	LOGOUT_FAIL,
} from 'containers/App/actions';

import {
	PUT_USER_LOAD,
	PUT_USER_SUCCESS,
	PUT_USER_FAIL,
} from 'containers/User/actionsSettings';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	user: {},
	createAccountLoading: false,
	createAccountError: undefined,
	loginLoading: false,
	loginError: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {

	case GET_SIGN_UP_DATA_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});
	case GET_SIGN_UP_DATA_SUCCESS:
		return state.merge({
			loading: false,
			user: {
				email: action.result.email
			}
		});
	case GET_SIGN_UP_DATA_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	case CREATE_ACCOUNT_LOAD:
		return state.merge({
			createAccountLoading: true,
			createAccountError: undefined,
		});
	case CREATE_ACCOUNT_SUCCESS:
		return state.merge({
			createAccountLoading: false,
			createAccountError: undefined,
			user: action.result,
		});
	case CREATE_ACCOUNT_FAIL:
		return state.merge({
			createAccountLoading: false,
			createAccountError: action.error,
		});
	case LOGIN_GET_LOAD:
	case LOGIN_POST_LOAD:
		return state.merge({
			loginLoading: true,
			loginError: undefined,
		});
	case LOGIN_GET_SUCCESS:
	case LOGIN_POST_SUCCESS:
		return state.merge({
			loginLoading: false,
			loginError: undefined,
			user: action.result,
		});
	case LOGIN_GET_FAIL:
	case LOGIN_POST_FAIL:
		return state.merge({
			loginLoading: false,
			loginError: action.error,
		});
	case LOGOUT_LOAD:
		return state;
	case LOGOUT_SUCCESS:
		window.location.reload();
		// return state.merge({
		// 	user: {},
		// });
		return state;
	case LOGOUT_FAIL:
		return state;

	case PUT_USER_LOAD:
		return state;
	case PUT_USER_SUCCESS:
		return state.mergeIn(['user'], action.result);
	case PUT_USER_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
