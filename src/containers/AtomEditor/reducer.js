import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_ATOM_LOAD,
	CREATE_ATOM_SUCCESS,
	CREATE_ATOM_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function createAtomLoad(state) {
	return state.merge({
		status: 'loading',
	});
}

function createAtomSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		atomData: result,
		error: null
	});
}

function createAtomFail(state, error) {
	return state.merge({
		status: 'loaded',
		atomData: {},
		error: error,
	});
}


/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_ATOM_LOAD:
		return createAtomLoad(state);
	case CREATE_ATOM_SUCCESS:
		return createAtomSuccess(state, action.result);
	case CREATE_ATOM_FAIL:
		return createAtomFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
