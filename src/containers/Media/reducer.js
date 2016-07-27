import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_MEDIA_LOAD,
	GET_MEDIA_SUCCESS,
	GET_MEDIA_FAIL,

	CREATE_ATOM_LOAD,
	CREATE_ATOM_SUCCESS,
	CREATE_ATOM_FAIL,
} from './actions';

import {
	GET_ATOM_EDIT_LOAD,
} from 'containers/AtomEditor/actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	mediaItems: [],
	loading: false,
	error: undefined,

	newAtomSlug: undefined,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function getMediaLoading(state) {
	return state.merge({
		loading: true,
		error: undefined,
	});
}

function getMediaSuccess(state, result) {
	return state.merge({
		mediaItems: result,
		loading: false,
		error: undefined,
	});
}

function getMediaFailed(state, error) {
	return state.merge({
		loading: true,
		error: error,
	});
}

function createAtomLoad(state) {
	return state;
}

function createAtomSuccess(state, result) {
	return state.merge({
		newAtomSlug: result,
	});
}

function createAtomFail(state, error) {
	return state;
}

function getAtomEditLoad(state) {
	return state.merge({
		newAtomSlug: undefined,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case GET_MEDIA_LOAD:
		return getMediaLoading(state);
	case GET_MEDIA_SUCCESS:
		return getMediaSuccess(state, action.result);
	case GET_MEDIA_FAIL:
		return getMediaFailed(state, action.error);

	case CREATE_ATOM_LOAD:
		return createAtomLoad(state);
	case CREATE_ATOM_SUCCESS:
		return createAtomSuccess(state, action.result);
	case CREATE_ATOM_FAIL:
		return createAtomFail(state, action.error);

	case GET_ATOM_EDIT_LOAD:
		return getAtomEditLoad(state);

	default:
		return ensureImmutable(state);
	}
}
