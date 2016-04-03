import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

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

} from './actions';

import {
	UPDATE_USER_SUCCESS,

	SET_NOTIFICATIONS_READ_LOAD,

} from 'containers/UserProfile/actions';

import {
	CREATE_ASSET_LOAD,
	CREATE_ASSET_SUCCESS,
	UPDATE_ASSET_LOAD,
	UPDATE_ASSET_SUCCESS,

} from 'containers/MediaLibrary/actions';

import {

	LOAD_APP_AND_LOGIN_LOAD,
	LOAD_APP_AND_LOGIN_SUCCESS,
	LOAD_APP_AND_LOGIN_FAIL,

} from 'containers/App/actions';
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
	assetLoading: false,
	addedHighlight: undefined,
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

function assetCreated(state, result, isHighlight) {
	const newState = state.mergeIn(['userData', 'assets'], state.getIn(['userData', 'assets']).push(result));
	return newState.merge({
		assetLoading: false,
		addedHighlight: isHighlight && result,
	});
}

function assetUpdated(state, result) {
	const assets = state.getIn(['userData', 'assets']).toJS();
	const newAssets = assets.map((asset)=>{
		if (asset._id === result._id) {
			return result;
		}
		return asset;
	});
	const newState = state.mergeIn(['userData', 'assets'], newAssets);
	return newState.set('assetLoading', false);
}

function assetLoading(state) {
	return state.merge({
		assetLoading: true,
		addedHighlight: undefined,
	});
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

	case LOAD_APP_AND_LOGIN_LOAD:
		return state;
	case LOAD_APP_AND_LOGIN_SUCCESS:
		return loggedIn(state, action.result.loginData);
	case LOAD_APP_AND_LOGIN_FAIL:
		return failed(state, action.error);

	case UPDATE_USER_SUCCESS:
		return updateUserSuccess(state, action.result);

	case FOLLOW_SUCCESS:
		return followSuccess(state, action.result);

	case UNFOLLOW_SUCCESS:
		return unfollowSuccess(state, action.result);

	case SET_NOTIFICATIONS_READ_LOAD:
		return setNotificationsRead(state);

	case CREATE_ASSET_LOAD:
		return assetLoading(state);
	case CREATE_ASSET_SUCCESS:
		return assetCreated(state, action.result, action.isHighlight);
	case UPDATE_ASSET_LOAD:
		return assetLoading(state);
	case UPDATE_ASSET_SUCCESS:
		return assetUpdated(state, action.result);

	default:
		return ensureImmutable(state);
	}
}
