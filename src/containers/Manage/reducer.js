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

	UPDATE_ATOM_DETAILS_LOAD,
	UPDATE_ATOM_DETAILS_SUCCESS,
	UPDATE_ATOM_DETAILS_FAIL,

	ADD_CONTRIBUTOR_LOAD,
	ADD_CONTRIBUTOR_SUCCESS,
	ADD_CONTRIBUTOR_FAIL,

	UPDATE_CONTRIBUTOR_LOAD,
	UPDATE_CONTRIBUTOR_SUCCESS,
	UPDATE_CONTRIBUTOR_FAIL,

	DELETE_CONTRIBUTOR_LOAD,
	DELETE_CONTRIBUTOR_SUCCESS,
	DELETE_CONTRIBUTOR_FAIL,
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
		if (item.getIn(['parent', '_id']) === result.parent) {
			newVersion.parent = item.get('parent');
			return ensureImmutable(newVersion);
		}
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

/* Add Contributor functions */
/* ----------------------------- */
function addContributorSuccess(state, result) {
	return state.merge({
		mediaItems: state.get('mediaItems').map((item)=>{
			if (item.getIn(['parent', '_id']) === result.destination) {
				return item.merge({
					contributors: item.get('contributors').push(ensureImmutable(result))
				});	
			}
			return item;
		})
	});
}

/* Update Contributor functions */
/* ----------------------------- */
function updateContributorSuccess(state, result) {
	return state;
}

/* Delete Contributor functions */
/* ----------------------------- */
function deleteContributorSuccess(state, result) {
	return state.merge({
		mediaItems: state.get('mediaItems').map((item)=>{
			if (item.getIn(['parent', '_id']) === result.destination) {
				return item.merge({
					contributors: item.get('contributors').filter((contributor)=> {
						return contributor.get('_id') !== result._id;
					})
				});	
			}
			return item;
		})
	});
}

/* Update Atom Details functions */
/* ----------------------------- */
function updateAtomDetailsLoad(state, atomID) {
	return state.merge({
		mediaItems: state.get('mediaItems').map((item)=>{
			if (item.getIn(['parent', '_id']) === atomID) {
				return item.merge({
					detailsLoading: true,
					detailsError: undefined
				});	
			}
			return item;
		}),
	});
}

function updateAtomDetailsSuccess(state, result, atomID) {
	return state.merge({
		mediaItems: state.get('mediaItems').map((item)=>{
			if (item.getIn(['parent', '_id']) === atomID) {
				return item.merge({
					parent: result,
					detailsLoading: false,
					detailsError: undefined
				});	
			}
			return item;
		}),
	});
}

function updateAtomDetailsFail(state, error, atomID) {
	return state.merge({
		mediaItems: state.get('mediaItems').map((item)=>{
			if (item.getIn(['parent', '_id']) === atomID) {
				return item.merge({
					detailsLoading: false,
					detailsError: error
				});	
			}
			return item;
		}),
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

	case ADD_CONTRIBUTOR_LOAD:
		return state;
	case ADD_CONTRIBUTOR_SUCCESS:
		return addContributorSuccess(state, action.result);
	case ADD_CONTRIBUTOR_FAIL:
		return state;

	case UPDATE_CONTRIBUTOR_LOAD:
		return state;
	case UPDATE_CONTRIBUTOR_SUCCESS:
		return updateContributorSuccess(state, action.result);
	case UPDATE_CONTRIBUTOR_FAIL:
		return state;

	case DELETE_CONTRIBUTOR_LOAD:
		return state;
	case DELETE_CONTRIBUTOR_SUCCESS:
		return deleteContributorSuccess(state, action.result);
	case DELETE_CONTRIBUTOR_FAIL:
		return state;

	case UPDATE_ATOM_DETAILS_LOAD:
		return updateAtomDetailsLoad(state, action.atomID);
	case UPDATE_ATOM_DETAILS_SUCCESS:
		return updateAtomDetailsSuccess(state, action.result, action.atomID);
	case UPDATE_ATOM_DETAILS_FAIL:
		return updateAtomDetailsFail(state, action.error, action.atomID);

	default:
		return ensureImmutable(state);
	}
}
