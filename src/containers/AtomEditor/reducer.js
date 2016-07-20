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

	GET_ATOM_CONTRIBUTORS_LOAD,
	GET_ATOM_CONTRIBUTORS_SUCCESS,
	GET_ATOM_CONTRIBUTORS_FAIL,

	SAVE_VERSION_LOAD,
	SAVE_VERSION_SUCCESS,
	SAVE_VERSION_FAIL,

	UPDATE_ATOM_DETAILS_LOAD,
	UPDATE_ATOM_DETAILS_SUCCESS,
	UPDATE_ATOM_DETAILS_FAIL,

	PUBLISH_VERSION_LOAD,
	PUBLISH_VERSION_SUCCESS,
	PUBLISH_VERSION_FAIL,

	UPDATE_ATOM_CONTRIBUTORS_LOAD,
	UPDATE_ATOM_CONTRIBUTORS_SUCCESS,
	UPDATE_ATOM_CONTRIBUTORS_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	currentVersionData: {},
	loading: false,
	error: null,
	newAtomHash: undefined,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

/* Create Atom functions */
/* ----------------------------- */
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

/* Get Atom Edit functions */
/* ----------------------------- */
function getAtomEditLoad(state) {
	return state.merge({
		newAtomHash: undefined,
		loading: true,
	});
}

function getAtomEditSuccess(state, result) {
	return state.merge({
		loading: false,
		atomData: result.atomData,
		contributorData: result.contributorData,
		currentVersionData: result.currentVersionData,
		error: null
	});
}

function getAtomEditFail(state, error) {
	return state.merge({
		loading: false,
		atomData: {},
		currentVersionData: {},
		error: error,
	});
}


/* Save Version functions */
/* ----------------------------- */
function saveVersionLoad(state) {
	return state.merge({
		loading: true,
	});
}

function saveVersionSuccess(state, result) {
	const newAtomData = state.get('atomData').toJS();
	newAtomData.versions.push(result);
	return state.merge({
		loading: false,
		atomData: newAtomData,
		currentVersionData: result,
		error: null
	});
}

function saveVersionFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

/* Update Atom Details functions */
/* ----------------------------- */
function updateAtomDetailsLoad(state) {
	return state.merge({
		loading: true,
	});
}

function updateAtomDetailsSuccess(state, result) {
	return state.merge({
		loading: false,
		atomData: result,
		error: null
	});
}

function updateAtomDetailsFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

/* Update Atom Details functions */
/* ----------------------------- */
function updateAtomContributorsLoad(state) {
	return state.merge({
		loading: true,
	});
}

function updateAtomContributorsSuccess(state, result) {
	console.log('Updated success!', result);
	return state.merge({
		loading: false,
		contributorData: result.contributorData,
		error: null
	});
}

function updateAtomContributorsFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}


/* Publish Version functions */
/* ----------------------------- */
function publishVersionLoad(state) {
	return state.merge({
		loading: true,
	});
}

function publishVersionSuccess(state, result) {
	return state.merge({
		loading: false,
		error: null
	}).updateIn(['atomData', 'versions'], (versionsList)=> {
		return versionsList.map((item)=>{
			if (item.get('_id') === result._id) { return ensureImmutable(result); }
			return item;
		});
	});
}

function publishVersionFail(state, error) {
	return state.merge({
		loading: false,
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

	case SAVE_VERSION_LOAD:
		return saveVersionLoad(state);
	case SAVE_VERSION_SUCCESS:
		return saveVersionSuccess(state, action.result);
	case SAVE_VERSION_FAIL:
		return saveVersionFail(state, action.error);

	case UPDATE_ATOM_DETAILS_LOAD:
		return updateAtomDetailsLoad(state);
	case UPDATE_ATOM_DETAILS_SUCCESS:
		return updateAtomDetailsSuccess(state, action.result);
	case UPDATE_ATOM_DETAILS_FAIL:
		return updateAtomDetailsFail(state, action.error);

	case PUBLISH_VERSION_LOAD:
		return publishVersionLoad(state);
	case PUBLISH_VERSION_SUCCESS:
		return publishVersionSuccess(state, action.result);
	case PUBLISH_VERSION_FAIL:
		return publishVersionFail(state, action.error);

	case UPDATE_ATOM_CONTRIBUTORS_LOAD:
		return updateAtomContributorsLoad(state);
	case UPDATE_ATOM_CONTRIBUTORS_SUCCESS:
		return updateAtomContributorsSuccess(state, action.result);
	case UPDATE_ATOM_CONTRIBUTORS_FAIL:
		return updateAtomContributorsFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
