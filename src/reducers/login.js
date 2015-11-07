import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	TOGGLE_VISIBILITY,
	LOGIN_LOAD,
	LOGIN_LOAD_SUCCESS,
	LOGIN_LOAD_FAIL,
	RESTORE_LOGIN_LOAD,
	RESTORE_LOGIN_LOAD_SUCCESS,
	RESTORE_LOGIN_LOAD_FAIL,
	LOGOUT_LOAD,
	LOGOUT_LOAD_SUCCESS,
	LOGOUT_LOAD_FAIL
} from '../actions/login';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	isVisible: false,
	loggedIn: false,
	loggingIn: false,
	// attemptedRestoreState: false,
	userData: {}
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function toggle(state) {
	return state.set('isVisible', !state.get('isVisible'));
}

function loading(state) {
	return state.merge({
		loggingIn: true,
	});
}

function loggedIn(state, user) {
	let outputMerge = {};
	if (user === 'No Session') {
		outputMerge = {
			isVisible: false,
			loggingIn: false,
			loggedIn: false,
			userData: {}
		};
	} else {
		outputMerge = {
			isVisible: false,
			loggingIn: false,
			loggedIn: true,
			userData: user
		};
	}
	return state.merge(outputMerge);
}

function loggedOut(state) {
	return state.merge({
		isVisible: false,
		loggedIn: false,
		loggingIn: false,
		userData: undefined
	});
}

function failed(state) {
	return state.merge({
		loggedIn: false,
		loggingIn: false,
		userData: {'error': true}
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case TOGGLE_VISIBILITY:
		return toggle(state);

	case LOGIN_LOAD:
		return loading(state);

	case LOGIN_LOAD_SUCCESS:
		return loggedIn(state, action.result);

	case LOGIN_LOAD_FAIL:
		return failed(state);

	case RESTORE_LOGIN_LOAD:
		return state;

	case RESTORE_LOGIN_LOAD_SUCCESS:
		return loggedIn(state, action.result);

	case RESTORE_LOGIN_LOAD_FAIL:
		return failed(state);

	case LOGOUT_LOAD:
		return loading(state);

	case LOGOUT_LOAD_SUCCESS:
		return loggedOut(state);

	case LOGOUT_LOAD_FAIL:
		return failed(state);


	default:
		return ensureImmutable(state);
	}
}
