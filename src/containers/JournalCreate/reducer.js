import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	newJournalSlug: undefined,
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function createJournalLoading(state) {
	return state.merge({
		loading: true,
		error: undefined
	});
}

function createJournalSuccess(state, newJournalSlug) {
	return state.merge({
		newJournalSlug: newJournalSlug,
		loading: false,
		error: undefined
	});
}

function createJournalFailed(state, error) {
	return state.merge({
		loading: false, 
		error: error
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_JOURNAL_LOAD:
		return createJournalLoading(state);
	case CREATE_JOURNAL_SUCCESS:
		return createJournalSuccess(state, action.result);
	case CREATE_JOURNAL_FAIL:
		return createJournalFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
