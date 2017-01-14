import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_USER_DATA_LOAD,
	GET_USER_DATA_SUCCESS,
	GET_USER_DATA_FAIL,
} from 'containers/User/actions';

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
	settingsLoading: false,
	settingsError: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_USER_DATA_LOAD:
		return state.merge({
			loading: true,
			error: false,
			user: {},
		});	
	case GET_USER_DATA_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			user: action.result
		});
	case GET_USER_DATA_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
			user: null,
		});

	case PUT_USER_LOAD:
		return state.merge({
			settingsLoading: true,
			settingsError: undefined,
		});	
	case PUT_USER_SUCCESS:
		return state.merge({
			settingsLoading: false,
			settingsError: undefined,
		})
		.mergeIn(['user'], action.result);
	case PUT_USER_FAIL:
		return state.merge({
			settingsLoading: false,
			settingsError: action.error,
		});	

	default:
		return ensureImmutable(state);
	}
}
