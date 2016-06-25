import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_ATOM_LOAD,
	CREATE_ATOM_SUCCESS,
	CREATE_ATOM_FAIL,

	GET_ATOM_EDIT_LOAD,
	GET_ATOM_EDIT_SUCCESS,
	GET_ATOM_EDIT_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	versionData: {},
	status: 'loading',
	error: null,
	newAtomHash: undefined,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function createAtomLoad(state) {
	return state;
}

function createAtomSuccess(state, result) {
	return state.merge({
		newAtomHash: result,
	});
}

function createAtomFail(state, error) {
	return state;
}

function getAtomEditLoad(state) {
	return state.merge({
		newAtomHash: undefined,
		status: 'loading',
	});
}

function getAtomEditSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		atomData: result.atomData,
		versionData: result.versionData,
		error: null
	});
}

function getAtomEditFail(state, error) {
	return state.merge({
		status: 'loaded',
		atomData: {},
		versionData: {},
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

	case GET_ATOM_EDIT_LOAD:
		return getAtomEditLoad(state);
	case GET_ATOM_EDIT_SUCCESS:
		return getAtomEditSuccess(state, action.result);
	case GET_ATOM_EDIT_FAIL:
		return getAtomEditFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
