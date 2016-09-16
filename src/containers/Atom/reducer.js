import Immutable from 'immutable';
import {
	CREATE_REPLY_DOCUMENT_SUCCESS,

} from 'containers/Discussions/actions';
import {ensureImmutable} from 'reducers';

import {
	GET_ATOM_DATA_LOAD,
	GET_ATOM_DATA_SUCCESS,
	GET_ATOM_DATA_FAIL,

	SUBMIT_ATOM_TO_JOURNAL_LOAD,
	SUBMIT_ATOM_TO_JOURNAL_SUCCESS,
	SUBMIT_ATOM_TO_JOURNAL_FAIL,

	SAVE_VERSION_LOAD,
	SAVE_VERSION_SUCCESS,
	SAVE_VERSION_FAIL,

	UPDATE_ATOM_DETAILS_LOAD,
	UPDATE_ATOM_DETAILS_SUCCESS,
	UPDATE_ATOM_DETAILS_FAIL,

	PUBLISH_VERSION_LOAD,
	PUBLISH_VERSION_SUCCESS,
	PUBLISH_VERSION_FAIL,

	ADD_CONTRIBUTOR_LOAD,
	ADD_CONTRIBUTOR_SUCCESS,
	ADD_CONTRIBUTOR_FAIL,

	UPDATE_CONTRIBUTOR_LOAD,
	UPDATE_CONTRIBUTOR_SUCCESS,
	UPDATE_CONTRIBUTOR_FAIL,

	DELETE_CONTRIBUTOR_LOAD,
	DELETE_CONTRIBUTOR_SUCCESS,
	DELETE_CONTRIBUTOR_FAIL,
} from './actions';

/*--------*/
// Load Actions
/*--------*/


/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	atomData: {},
	authorsData: [],
	currentVersionData: {},
	versionsData: [],
	contributorsData: [],
	submittedData: [],
	featuredData: [],
	discussionsData: [],
	loading: true,
	error: null,

	token: undefined,
	tokenValid: undefined,
	newAtomHash: undefined,

	// modalLoading: false,
	// modalError: null,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function getAtomDataLoad(state) {
	return state.merge({
		loading: true,
	});
}

function getAtomDataSuccess(state, result) {
	return state.merge({
		loading: false,
		atomData: result.atomData,
		authorsData: result.authorsData,
		currentVersionData: result.currentVersionData,
		versionsData: result.versionsData,
		contributorsData: result.contributorsData,
		submittedData: result.submittedData,
		featuredData: result.featuredData,
		discussionsData: result.discussionsData,
		followersData: result.followersData,
		token: result.token,
		tokenValid: result.tokenValid,
		error: null
	});
}

function getAtomDataFail(state, error) {
	return state.merge({
		loading: false,
		atomData: { permissionType: error.permissionType},
		// authorsData: [],
		// currentVersionData: {},
		// versionsData: [],
		// contributorsData: [],
		// submittedData: [],
		// featuredData: [],
		// discussionsData: [],
		// followersData: [],
		error: error,
	});
}

function submitAtomToJournalLoad(state) {
	return state.merge({
		loading: true,
	});
}

function submitAtomToJournalSuccess(state, result) {
	return state.merge({
		loading: false,
		submittedData: result,
	});
}

function submitAtomToJournalFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

function createReplyDocumentSuccess(state, result) {
	const newDiscussion = {
		...result,
		isNewReply: true,
	};
	return state.merge({
		discussionsData: state.get('discussionsData').unshift(newDiscussion),
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
	const newVersionsData = state.get('versionsData').toJS();
	newVersionsData.push(result);
	const atomData = state.get('atomData');
	return state.merge({
		loading: false,
		versionsData: newVersionsData,
		atomData: atomData.mergeIn(['versions'], atomData.get('versions').push(result._id)),
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
		atomData: state.get('atomData').merge(result),
		error: null
	});
}

function updateAtomDetailsFail(state, error) {
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
	}).updateIn(['versionsData'], (versionsList)=> {
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

/* Add Contributor functions */
/* ----------------------------- */
function addContributorSuccess(state, result) {
	return state.merge({
		contributorsData: state.get('contributorsData').push(ensureImmutable(result))
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
	// Remove the admin the the list by ID
	return state.merge({
		contributorsData: state.get('contributorsData').filter((item)=> {
			return item.get('_id') !== result._id;
		})
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

	case CREATE_REPLY_DOCUMENT_SUCCESS:
		return createReplyDocumentSuccess(state, action.result);

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

	default:
		return ensureImmutable(state);
	}
}
