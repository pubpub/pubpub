import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */

import {
	RESET_PASSWORD_LOAD,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAIL,

} from 'containers/ResetPassword/actions';


import {
		CHANGE_PASSWORD_HASH_LOAD,
		CHANGE_PASSWORD_HASH_SUCCESS,
		CHANGE_PASSWORD_HASH_FAIL,
} from 'containers/ChangePassword/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	user: {},
});


/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	console.log("HELL O YES REDUCER CALLSSD " + JSON.stringify(action))

	switch (action.type) {

	case RESET_PASSWORD_LOAD:
		return state.merge({
			resetPasswordLoading: true,
			resetPasswordError: undefined,
		});
	case RESET_PASSWORD_SUCCESS:
		return state.merge({
			resetPasswordLoading: false,
			resetPasswordError: undefined,
		});
	case RESET_PASSWORD_FAIL:
		return state.merge({
			resetPasswordError: action.error,
			resetPasswordLoading: false,
		});

	case CHANGE_PASSWORD_HASH_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});
	case CHANGE_PASSWORD_HASH_SUCCESS:
		return state.merge({
			loading: false,
			user: {
				email: action.result.email
			}
		});
	case CHANGE_PASSWORD_HASH_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	default:
		return ensureImmutable(state);
	}
}
