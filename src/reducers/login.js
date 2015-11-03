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

function loggedIn(state, user) {
	return state.merge({
		isVisible: false,
		loggedIn: true,
		userData: user
	});
}

function loggedOut(state) {
	return state.merge({
		isVisible: false,
		loggedIn: false,
		userData: undefined
	});
}

function failed(state) {
	return state.merge({
		isVisible: true,
		loggedIn: false,
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
		return state;

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
		return state;

	case LOGOUT_LOAD_SUCCESS:
		return loggedOut(state);

	case LOGOUT_LOAD_FAIL:
		return failed(state);


	default:
		return ensureImmutable(state);
	}
}
