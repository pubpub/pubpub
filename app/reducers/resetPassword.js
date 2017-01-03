import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	RESET_PASSWORD_LOAD,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAIL,

	CHECK_RESET_HASH_LOAD,
	CHECK_RESET_HASH_SUCCESS,
	CHECK_RESET_HASH_FAIL,

	SET_PASSWORD_LOAD,
	SET_PASSWORD_SUCCESS,
	SET_PASSWORD_FAIL,
} from 'containers/ResetPassword/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	checkResetHashLoading: true,
	checkResetHashError: undefined
});


/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {

	switch (action.type) {

	case RESET_PASSWORD_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});
	case RESET_PASSWORD_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
		});
	case RESET_PASSWORD_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	case SET_PASSWORD_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});
	case SET_PASSWORD_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
		});
	case SET_PASSWORD_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	case CHECK_RESET_HASH_LOAD:
		return state.merge({
			checkResetHashLoading: true,
			checkResetHashError: undefined,
		});
	case CHECK_RESET_HASH_SUCCESS:
		return state.merge({
			checkResetHashLoading: false,
			checkResetHashError: undefined,
		});
	case CHECK_RESET_HASH_FAIL:
		return state.merge({
			checkResetHashLoading: false,
			checkResetHashError: true,
		});

	default:
		return ensureImmutable(state);
	}
}
