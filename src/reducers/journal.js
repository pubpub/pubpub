import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,

	LOAD_JOURNAL_AND_LOGIN,
	LOAD_JOURNAL_AND_LOGIN_SUCCESS,
	LOAD_JOURNAL_AND_LOGIN_FAIL,

} from '../actions/journal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	createJournalData: {
		journalCreated: false,
		status: 'loaded',
		error: null,
		subdomain: null,	
	},

});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function createJournalLoad(state) {
	return state.mergeIn(['createJournalData'], {
		status: 'loading',
		error: null,
		subdomain: null,
	});
}

function createJournalSuccess(state, result) {

	return state.mergeIn(['createJournalData'], {
		status: 'loaded',
		error: null,
		journalCreated: true,
		subdomain: result,
	});
}

function createJournalFail(state, error) {
	return state.mergeIn(['createJournalData'], {
		status: 'loaded',
		error: error,
	});
}

function loadJournalSuccess(state, journalData) {
	return state.merge(journalData);
}

function loadJournalFail(state, error) {	
	return state.merge({
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {
	switch (action.type) {

	case CREATE_JOURNAL_LOAD:
		return createJournalLoad(state);
	case CREATE_JOURNAL_SUCCESS:
		return createJournalSuccess(state, action.result);
	case CREATE_JOURNAL_FAIL:
		return createJournalFail(state, action.error);

	case LOAD_JOURNAL_AND_LOGIN:
		return state;
	case LOAD_JOURNAL_AND_LOGIN_SUCCESS:
		return loadJournalSuccess(state, action.result.journalData);
	case LOAD_JOURNAL_AND_LOGIN_FAIL:
		return loadJournalFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
