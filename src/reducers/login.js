import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	TOGGLE_VISIBILITY,
	TOGGLE_VIEWMODE,
	LOGIN_LOAD,
	LOGIN_LOAD_SUCCESS,
	LOGIN_LOAD_FAIL,
	// RESTORE_LOGIN_LOAD,
	// RESTORE_LOGIN_LOAD_SUCCESS,
	// RESTORE_LOGIN_LOAD_FAIL,
	LOGOUT_LOAD,
	LOGOUT_LOAD_SUCCESS,
	LOGOUT_LOAD_FAIL,
	REGISTER_LOAD,
	REGISTER_LOAD_SUCCESS,
	REGISTER_LOAD_FAIL,

	UPDATE_USER_SETTINGS_LOAD,
	UPDATE_USER_SETTINGS_SUCCESS,
	UPDATE_USER_SETTINGS_FAIL,

	// FOLLOW_LOAD,
	FOLLOW_SUCCESS,
	// FOLLOW_FAIL,

	// UNFOLLOW_LOAD,
	UNFOLLOW_SUCCESS,
	// UNFOLLOW_FAIL,

} from '../actions/login';

import {
	UPDATE_USER_SUCCESS,

	SET_NOTIFICATIONS_READ_LOAD,

} from '../actions/user';

import {

	LOAD_JOURNAL_AND_LOGIN,
	LOAD_JOURNAL_AND_LOGIN_SUCCESS,
	LOAD_JOURNAL_AND_LOGIN_FAIL,

} from '../actions/journal';
/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	isVisible: false,
	loggedIn: false,
	loggingIn: false,
	viewMode: 'login',
	attemptedRestoreState: false,
	userData: {},
	error: undefined
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function toggle(state) {
	return state.merge({
		isVisible: !state.get('isVisible'),
		viewMode: 'login',
		error: undefined
	});
}

function toggleViewMode(state) {
	let newViewMode = 'login';
	if (state.get('viewMode') === 'login') {
		newViewMode = 'register';
	}
	return state.merge({
		viewMode: newViewMode,
		error: undefined
	});
}

function loading(state) {
	return state.merge({
		loggingIn: true,
		error: undefined
	});
}

function loggedIn(state, user) {
	let outputMerge = {};
	if (user === 'No Session') {
		outputMerge = {
			isVisible: false,
			loggingIn: false,
			loggedIn: false,
			error: undefined,
			attemptedRestoreState: true,
			userData: {}
		};
	} else {
		outputMerge = {
			isVisible: false,
			loggingIn: false,
			loggedIn: true,
			error: undefined,
			attemptedRestoreState: true,
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

function failed(state, error) {
	console.log('failed error is: ', error);
	let errorMessage = '';
	if (error.toString() === 'Error: Unauthorized') {
		errorMessage = 'Invalid Username or Password';
	} else {
		errorMessage = 'Email already used';
	}
	
	return state.merge({
		loggedIn: false,
		loggingIn: false,
		error: errorMessage,
		userData: {'error': true}
	});
}

function userSettingsUpdate(state, result) {
	return state.mergeIn(['userData', 'settings'], result);
}

function updateUserSuccess(state, result) {
	return state.merge({
		userData: { ...state.get('userData').toJS(), ...result},
	});
}

function followSuccess(state, result) {
	const following = state.getIn(['userData', 'following'])
		? state.getIn(['userData', 'following']).toJS()
		: {pubs: [], users: [], journals: []};

	following[result.type].push(result.followedID);
	return state.mergeIn(['userData', 'following'], following);
}

function unfollowSuccess(state, result) {
	const index = state.getIn(['userData', 'following', result.type]).indexOf(result.followedID);
	return state.deleteIn(['userData', 'following', result.type, index]);
}

function setNotificationsRead(state) {
	if (!state.get('loggedIn')) {
		return state;
	}
	return state.mergeIn(['userData', 'notificationCount'], 0);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case TOGGLE_VISIBILITY:
		return toggle(state);
	case TOGGLE_VIEWMODE:
		return toggleViewMode(state);
	case LOGIN_LOAD:
		return loading(state);
	case LOGIN_LOAD_SUCCESS:
		return loggedIn(state, action.result);
	case LOGIN_LOAD_FAIL:
		return failed(state, action.error);
	case LOGOUT_LOAD:
		return loading(state);
	case LOGOUT_LOAD_SUCCESS:
		return loggedOut(state);
	case LOGOUT_LOAD_FAIL:
		return failed(state, action.error);
	case REGISTER_LOAD:
		return loading(state);
	case REGISTER_LOAD_SUCCESS:
		return loggedIn(state, action.result);
	case REGISTER_LOAD_FAIL:
		return failed(state, action.error);
	case UPDATE_USER_SETTINGS_LOAD:
		return state;
	case UPDATE_USER_SETTINGS_SUCCESS:
		return userSettingsUpdate(state, action.result);
	case UPDATE_USER_SETTINGS_FAIL:
		return state;

	case LOAD_JOURNAL_AND_LOGIN:
		return state;
	case LOAD_JOURNAL_AND_LOGIN_SUCCESS:
		return loggedIn(state, action.result.loginData);
	case LOAD_JOURNAL_AND_LOGIN_FAIL:
		return failed(state, action.error);

	case UPDATE_USER_SUCCESS:
		return updateUserSuccess(state, action.result);

	case FOLLOW_SUCCESS:
		return followSuccess(state, action.result);

	case UNFOLLOW_SUCCESS:
		return unfollowSuccess(state, action.result);

	case SET_NOTIFICATIONS_READ_LOAD:
		return setNotificationsRead(state);

	default:
		return ensureImmutable(state);
	}
}
