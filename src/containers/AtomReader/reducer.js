import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_ATOM_DATA_LOAD,
	GET_ATOM_DATA_SUCCESS,
	GET_ATOM_DATA_FAIL,

	SUBMIT_ATOM_TO_JOURNAL_LOAD, 
	SUBMIT_ATOM_TO_JOURNAL_SUCCESS, 
	SUBMIT_ATOM_TO_JOURNAL_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	authorsData: {},
	currentVersionData: {},
	versionsData: {},
	contributorData: {},
	submittedData: [],
	featuredData: [],
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function getAtomDataLoad(state) {
	return state.merge({
		status: 'loading',
	});
}

function getAtomDataSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		atomData: result.atomData,
		authorsData: result.authorsData,
		currentVersionData: result.currentVersionData,
		versionsData: result.versionsData,
		contributorData: result.contributorData,
		submittedData: result.submittedData,
		featuredData: result.featuredData,
		error: null
	});
}

function getAtomDataFail(state, error) {
	return state.merge({
		status: 'loaded',
		atomData: {},
		authorsData: {},
		currentVersionData: {},
		versionsData: {},
		contributorData: {},
		submittedData: [],
		featuredData: [],
		error: error,
	});
}

function submitAtomToJournalLoad(state) {
	return state.merge({
		status: 'loading',
	});
}

function submitAtomToJournalSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		submittedData: result,
	});
}

function submitAtomToJournalFail(state, error) {
	return state.merge({
		status: 'loaded',
		error: error,
	});
}	

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case GET_ATOM_DATA_LOAD:
		return getAtomDataLoad(state);
	case GET_ATOM_DATA_SUCCESS:
		return getAtomDataSuccess(state, action.result);
	case GET_ATOM_DATA_FAIL:
		return getAtomDataFail(state, action.error);

	case SUBMIT_ATOM_TO_JOURNAL_LOAD:
		return submitAtomToJournalLoad(state);
	case SUBMIT_ATOM_TO_JOURNAL_SUCCESS:
		return submitAtomToJournalSuccess(state, action.result);
	case SUBMIT_ATOM_TO_JOURNAL_FAIL:
		return submitAtomToJournalFail(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
