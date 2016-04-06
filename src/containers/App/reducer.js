import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	LOAD_APP_AND_LOGIN_LOAD,
	LOAD_APP_AND_LOGIN_SUCCESS,
	LOAD_APP_AND_LOGIN_FAIL,
	OPEN_MENU,
	CLOSE_MENU,
	// GET_RANDOM_SLUG_LOAD,
	GET_RANDOM_SLUG_SUCCESS,
	// GET_RANDOM_SLUG_FAIL,
} from './actions';

import {
	LOGIN_LOAD_SUCCESS,
	LOGOUT_LOAD_SUCCESS,
} from 'containers/Login/actions';

import {
	SAVE_JOURNAL_SUCCESS,
} from 'containers/JournalProfile/actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	status: 'loading',
	error: null,
	baseSubdomain: undefined, // Will be null if on pubpub, defined if on a journal, and undefined if not yet loaded
	journalData: {
		collections: [],
	},

	locale: 'en',
	languageObject: {},

	menuOpen: false,
	searchString: '',
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function loadApp(state) {
	return state.set('status', 'loading');
}

function loadAppSuccess(state, journalData, languageData) {
	// console.log('in success', journalData);
	const newBaseSubdomain = journalData.subdomain ? journalData.subdomain : null;
	return state.merge({
		status: 'loaded',
		error: null,
		baseSubdomain: state.get('baseSubdomain') === undefined ? newBaseSubdomain : state.get('baseSubdomain'),
		locale: languageData.locale,
		languageObject: languageData.languageObject,
		journalData
	});
}

function loadAppFail(state, error) {
	return state.merge({
		status: 'loaded',
		error: error,
	});
}

function openMenu(state) {
	return state.merge({
		menuOpen: true,
	});
}

function closeMenu(state) {
	return state.merge({
		menuOpen: false,
	});
}

function newRandomSlug(state, result) {
	if (!result) { return state; }

	return state.mergeIn(['journalData'], {
		randomSlug: result,
	});
}

function loginLoad(state, result) {
	return state.merge({
		journalData: {
			...state.get('journalData').toJS(),
			isAdmin: result.isAdminToJournal,
		},
	});
}

function logoutLoad(state) {
	return state.merge({
		journalData: {
			...state.get('journalData').toJS(),
			isAdmin: false,
		},
	});
}

function saveJournalSuccess(state, journalData) {
	return state.merge({
		journalData
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
		return loadAppSuccess(state, action.result.journalData, action.result.languageData);
	case LOAD_APP_AND_LOGIN_FAIL:
		return loadAppFail(state, action.error);
	case OPEN_MENU:
		return openMenu(state);
	case CLOSE_MENU:
		return closeMenu(state);
	case GET_RANDOM_SLUG_SUCCESS:
		return newRandomSlug(state, action.result);
	case LOGIN_LOAD_SUCCESS:
		return loginLoad(state, action.result);
	case LOGOUT_LOAD_SUCCESS:
		return logoutLoad(state);
	case SAVE_JOURNAL_SUCCESS:
		return saveJournalSuccess(state, action.result);
	default:
		return ensureImmutable(state);
	}
}
