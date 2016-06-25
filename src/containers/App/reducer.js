import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	LOAD_APP_AND_LOGIN_LOAD,
	LOAD_APP_AND_LOGIN_SUCCESS,
	LOAD_APP_AND_LOGIN_FAIL,
} from './actions';

import {
	LOGIN_SUCCESS,
} from 'containers/Login/actions';

import {
	SIGNUP_SUCCESS,
} from 'containers/SignUp/actions';

import {
	LOAD_PROFILE,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_FAIL,
} from 'containers/UserProfile/actions';

import {
	GET_ATOM_DATA_LOAD,
	GET_ATOM_DATA_SUCCESS,
	GET_ATOM_DATA_FAIL,
} from 'containers/AtomReader/actions';

import {
	CREATE_ATOM_LOAD,
	GET_ATOM_EDIT_LOAD,
	GET_ATOM_EDIT_SUCCESS,
	GET_ATOM_EDIT_FAIL,
} from 'containers/AtomEditor/actions';


/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loadAttempted: false,
	error: null,
	
	locale: 'en',
	languageObject: {},

	loading: false, // Used to animate the loading bar
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function loadApp(state) {
	return state.set('loadAttempted', true);
}

function loadAppSuccess(state, languageData) {
	return state.merge({
		locale: languageData.locale,
		languageObject: languageData.languageObject,
	});
}

function loadAppFail(state, error) {
	return state.merge({
		error: error,
	});
}

function setLoading(state) {
	return state.set('loading', true);
}
function unsetLoading(state) {
	return state.set('loading', false);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_APP_AND_LOGIN_LOAD:
		return loadApp(state);
	case LOAD_APP_AND_LOGIN_SUCCESS:
	case LOGIN_SUCCESS:
	case SIGNUP_SUCCESS:
		return loadAppSuccess(state, action.result.languageData);
	case LOAD_APP_AND_LOGIN_FAIL:
		return loadAppFail(state, action.error);


	case LOAD_PROFILE:
	case GET_ATOM_DATA_LOAD:
	case CREATE_ATOM_LOAD:
	case GET_ATOM_EDIT_LOAD:
		return setLoading(state);
	case LOAD_PROFILE_SUCCESS:
	case LOAD_PROFILE_FAIL:
	case GET_ATOM_DATA_SUCCESS:
	case GET_ATOM_DATA_FAIL:
	case GET_ATOM_EDIT_SUCCESS:
	case GET_ATOM_EDIT_FAIL:
		return unsetLoading(state);

	default:
		return ensureImmutable(state);
	}
}
