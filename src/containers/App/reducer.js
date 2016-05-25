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
	LOGIN_LOAD_SUCCESS,
} from 'containers/Login/actions';


/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loadAttempted: false,
	error: null,
	
	locale: 'en',
	languageObject: {},
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

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function appReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_APP_AND_LOGIN_LOAD:
		return loadApp(state);
	case LOAD_APP_AND_LOGIN_SUCCESS:
	case LOGIN_LOAD_SUCCESS:
		return loadAppSuccess(state, action.result.languageData);
	case LOAD_APP_AND_LOGIN_FAIL:
		return loadAppFail(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
