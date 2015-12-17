import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {

	LOAD_JOURNAL_AND_LOGIN,
	LOAD_JOURNAL_AND_LOGIN_SUCCESS,
	LOAD_JOURNAL_AND_LOGIN_FAIL,

} from '../actions/journal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function journalLoaded(state, journalData) {
	console.log('in journal loaded');
	return state.merge(journalData);
}

function failed(state, error) {	
	return state.merge({
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {

	case LOAD_JOURNAL_AND_LOGIN:
		return state;
	case LOAD_JOURNAL_AND_LOGIN_SUCCESS:
		return journalLoaded(state, action.result.journalData);
	case LOAD_JOURNAL_AND_LOGIN_FAIL:
		return failed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
