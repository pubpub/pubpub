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

	SAVE_VERSION_LOAD,
	SAVE_VERSION_SUCCESS,
	SAVE_VERSION_FAIL,
} from './actions';

import {
	GET_ATOM_DATA_LOAD,
} from 'containers/Atom/actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	mediaItems: [],
	loading: false,
	error: undefined,

	newAtomSlug: undefined,
	newNodeData: undefined, 
	redirect: false,
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
	return state.merge({
		newNodeData: undefined,
	});
}

function createAtomSuccess(state, result, redirect) {
	return state.merge({
		newAtomSlug: result.parent._id,
		mediaItems: state.get('mediaItems').push(result),
		newNodeData: result,
		redirect: redirect || false,
	});
}

function createAtomFail(state, error) {
	return state;
}

function getAtomDataLoad(state) {
	return state.merge({
		newAtomSlug: undefined,
	});
}

/* Save Version functions */
/* ----------------------------- */
function saveVersionLoad(state) {
	return state.merge({
		versionLoading: true,
		newNodeData: undefined,
	});
}

function saveVersionSuccess(state, result) {
	const newVersion = result;
	const newItems = state.get('mediaItems').map((item)=>{
		// if (item.getIn(['parent', '_id']) === result.parent) {
		// 	newVersion.parent = item.get('parent');
		// 	return ensureImmutable(newVersion);
		// }
		return item;
	});
	return state.merge({
		mediaItems: newItems,
		newNodeData: newVersion,
	});
}

function saveVersionFail(state, error) {
	return state.merge({
		versionLoading: false,
		versionError: error,
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
		return createAtomSuccess(state, action.result, action.redirect);
	case CREATE_ATOM_FAIL:
		return createAtomFail(state, action.error);

	case GET_ATOM_DATA_LOAD:
		return getAtomDataLoad(state);

	case SAVE_VERSION_LOAD:
		return saveVersionLoad(state);
	case SAVE_VERSION_SUCCESS:
		return saveVersionSuccess(state, action.result);
	case SAVE_VERSION_FAIL:
		return saveVersionFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
