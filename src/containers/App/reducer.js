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

// import {
// 	LOGIN_LOAD_SUCCESS,
// 	LOGOUT_LOAD_SUCCESS,
// } from 'containers/Login/actions';

// import {
// 	SAVE_JOURNAL_SUCCESS,
// } from 'containers/JournalProfile/actions';

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

// function openMenu(state) {
// 	return state.merge({
// 		menuOpen: true,
// 	});
// }

// function closeMenu(state) {
// 	return state.merge({
// 		menuOpen: false,
// 	});
// }

// function newRandomSlug(state, result) {
// 	if (!result) { return state; }

// 	return state.mergeIn(['journalData'], {
// 		randomSlug: result,
// 	});
// }

// function loginLoad(state, result) {
// 	return state.merge({
// 		journalData: {
// 			...state.get('journalData').toJS(),
// 			isAdmin: result.isAdminToJournal,
// 		},
// 	});
// }

// function logoutLoad(state) {
// 	return state.merge({
// 		journalData: {
// 			...state.get('journalData').toJS(),
// 			isAdmin: false,
// 		},
// 	});
// }

// function saveJournalSuccess(state, journalData) {
// 	return state.merge({
// 		journalData
// 	});
// }

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function appReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_APP_AND_LOGIN_LOAD:
		return loadApp(state);
	case LOAD_APP_AND_LOGIN_SUCCESS:
		return loadAppSuccess(state, action.result.languageData);
	case LOAD_APP_AND_LOGIN_FAIL:
		return loadAppFail(state, action.error);
	// case OPEN_MENU:
	// 	return openMenu(state);
	// case CLOSE_MENU:
	// 	return closeMenu(state);
	// case GET_RANDOM_SLUG_SUCCESS:
	// 	return newRandomSlug(state, action.result);
	// case LOGIN_LOAD_SUCCESS:
	// 	return loginLoad(state, action.result);
	// case LOGOUT_LOAD_SUCCESS:
	// 	return logoutLoad(state);
	// case SAVE_JOURNAL_SUCCESS:
	// 	return saveJournalSuccess(state, action.result);
	default:
		return ensureImmutable(state);
	}
}
