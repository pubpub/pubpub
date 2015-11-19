import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {LOAD_PUB, LOAD_PUB_SUCCESS, LOAD_PUB_FAIL} from '../actions/reader';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	pubData: {
		discussions: [],
		readNext: [],
		featuredIn: [],
		submittedTo: [],
		reviews: [],
		experts: [],

	},
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function load(state) {
	return state.set('status', 'loading');
}

function loadSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		pubData: result,
		error: null
	});
}

function loadFail(state, error) {
	console.log('in loadFail');
	return state.merge({
		status: 'failed',
		pubData: null,
		error: error
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_PUB:
		return load(state);
	case LOAD_PUB_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_PUB_FAIL:
		return loadFail(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
