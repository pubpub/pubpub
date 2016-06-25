import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_ATOM_DATA_LOAD,
	GET_ATOM_DATA_SUCCESS,
	GET_ATOM_DATA_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	versionData: {},
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
		versionData: result.versionData,
		error: null
	});
}

function getAtomDataFail(state, error) {
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
	case GET_ATOM_DATA_LOAD:
		return getAtomDataLoad(state);
	case GET_ATOM_DATA_SUCCESS:
		return getAtomDataSuccess(state, action.result);
	case GET_ATOM_DATA_FAIL:
		return getAtomDataFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
