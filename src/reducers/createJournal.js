import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,
} from '../actions/createJournal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	journalCreated: false,
	status: 'loaded',
	error: null,
	subdomain: null,
	journalName: undefined,
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function loading(state) {
	return state.merge({
		status: 'loading',
		error: null,
		subdomain: null,
	});
}

function journalCreated(state, result, journalName) {
	return state.merge({
		status: 'loaded',
		error: null,
		journalCreated: true,
		subdomain: result,
		journalName: journalName,
	});
}

function failed(state, error) {
	return state.merge({
		status: 'loaded',
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_JOURNAL_LOAD:
		return loading(state);

	case CREATE_JOURNAL_SUCCESS:
		return journalCreated(state, action.result, action.journalName);

	case CREATE_JOURNAL_FAIL:
		return failed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
