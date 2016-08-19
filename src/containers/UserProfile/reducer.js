import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_USER_LOAD,
	GET_USER_SUCCESS,
	GET_USER_FAIL,

	SAVE_SETTINGS_LOAD,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAIL,

	CHANGE_PASSWORD_LOAD, 
	CHANGE_PASSWORD_SUCCESS, 
	CHANGE_PASSWORD_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	profileData: {},
	loading: false,
	error: null
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function getUserLoad(state) {
	return state.merge({
		loading: true,
	});
}

function getUserSuccess(state, result) {
	return state.merge({
		profileData: result,
		loading: false,
		error: null
	});
}

function getUserFail(state, error) {
	return state.merge({
		loading: false,
		error: error
	});
}

function saveSettingsLoad(state) {
	return state.set('loading', true);
}

function saveSettingsSuccess(state, result) {

	return state.merge({
		loading: false,
		error: undefined,
	});
}

function saveSettingsFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

function changePasswordLoad(state) {
	return state.merge({
		loading: true,
	});
}

function changePasswordSuccess(state, result) {
	const successMessage = result;
	return state.merge({
		loading: false,
		error: null,
		success: successMessage,
	});
}

function changePasswordFail(state, error) {
	const errorMessage = error;
	return state.merge({
		loading: false,
		error: errorMessage,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case GET_USER_LOAD:
		return getUserLoad(state);
	case GET_USER_SUCCESS:
		return getUserSuccess(state, action.result);
	case GET_USER_FAIL:
		return getUserFail(state, action.error);

	case SAVE_SETTINGS_LOAD:
		return saveSettingsLoad(state);
	case SAVE_SETTINGS_SUCCESS:
		return saveSettingsSuccess(state, action.result);
	case SAVE_SETTINGS_FAIL:
		return saveSettingsFail(state, action.error);

	case CHANGE_PASSWORD_LOAD:
		return changePasswordLoad(state);
	case CHANGE_PASSWORD_SUCCESS:
		return changePasswordSuccess(state, action.result);
	case CHANGE_PASSWORD_FAIL:
		return changePasswordFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
