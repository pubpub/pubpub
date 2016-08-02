import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_JOURNAL_LOAD,
	GET_JOURNAL_SUCCESS,
	GET_JOURNAL_FAIL,

	UPDATE_JOURNAL_LOAD,
	UPDATE_JOURNAL_SUCCESS,
	UPDATE_JOURNAL_FAIL,

	CREATE_COLLECTION_LOAD, 
	CREATE_COLLECTION_SUCCESS, 
	CREATE_COLLECTION_FAIL,

	UPDATE_COLLECTION_LOAD, 
	UPDATE_COLLECTION_SUCCESS, 
	UPDATE_COLLECTION_FAIL,

	DELETE_COLLECTION_LOAD, 
	DELETE_COLLECTION_SUCCESS, 
	DELETE_COLLECTION_FAIL,

	FEATURE_ATOM_LOAD,
	FEATURE_ATOM_SUCCESS,
	FEATURE_ATOM_FAIL,
	
	REJECT_ATOM_LOAD,
	REJECT_ATOM_SUCCESS,
	REJECT_ATOM_FAIL,

	ADD_ADMIN_LOAD,
	ADD_ADMIN_SUCCESS,
	ADD_ADMIN_FAIL,

	DELETE_ADMIN_LOAD,
	DELETE_ADMIN_SUCCESS,
	DELETE_ADMIN_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	journalData: {},
	submittedData: [],
	featuredData: [],
	atomsData: [],
	adminsData: [],
	loading: false,
	error: null,

	saveLoading: false,
	saveError: null,

});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/


// Get Journal Functions
// ---------------------
function getJournalLoad(state) {
	return state.set('loading', true);
}

function getJournalSuccess(state, result) {
	return state.merge({
		journalData: result.journalData,
		submittedData: result.submittedData,
		featuredData: result.featuredData,
		atomsData: result.atomsData,
		adminsData: result.adminsData,
		loading: false,
		error: null,
	});
}

function getJournalFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}


// Update Journal Functions
// ---------------------
function updateJournalLoad(state) {
	return state.set('saveLoading', true);
}

function updateJournalSuccess(state, result) {
	return state.merge({
		journalData: {
			...result,
			isAdmin: state.getIn(['journalData', 'isAdmin']),
		},
		saveLoading: false,
		saveError: null,
	});
}

function updateJournalFail(state, error) {
	return state.merge({
		saveLoading: false,
		saveError: error,
	});
}

// Create Collection Functions
// ---------------------
function createCollectionSuccess(state, result) {
	const newCollections = [result].concat(state.getIn(['journalData', 'collections']).toJS());
	return state.mergeIn(['journalData', 'collections'], newCollections);
}

// Update Collection Functions
// ---------------------
function updateCollectionSuccess(state, result) {
	const newCollections = state.getIn(['journalData', 'collections']).map((item)=>{
		if (item.get('_id') === result._id) { return ensureImmutable(result); }
		return item;
	});
	return state.setIn(['journalData', 'collections'], newCollections);
}


// Delete Collection Functions
// ---------------------
function deleteCollectionSuccess(state, result) {
	const newCollections = state.getIn(['journalData', 'collections']).filter((item)=>{
		return item.get('_id') !== result;
	});
	return state.setIn(['journalData', 'collections'], newCollections);
}


// Feature Atom Functions
// ---------------------
function featureAtomSuccess(state, result) {
	const newSubmittedData = state.getIn(['submittedData']).map((item)=>{
		if (item.get('_id') === result._id) { 
			return item.merge({
				inactive: result.inactive,
				inactiveDate: result.inactiveDate,
				inactiveBy: result.inactiveBy,
				inactiveNote: result.inactiveNote,
			}); 
		}
		return item;
	});
	return state.set('submittedData', newSubmittedData);
}


// Reject Atom Functions
// ---------------------
function rejectAtomSuccess(state, result) {
	const newSubmittedData = state.getIn(['submittedData']).map((item)=>{
		if (item.get('_id') === result._id) { 
			return item.merge({
				inactive: result.inactive,
				inactiveDate: result.inactiveDate,
				inactiveBy: result.inactiveBy,
				inactiveNote: result.inactiveNote,
			}); 
		}
		return item;
	});
	return state.set('submittedData', newSubmittedData);
}

// Add Admin Functions
// ---------------------
function addAdminSuccess(state, result) {
	// Add the admin the the list
	return state.merge({
		adminsData: state.get('adminsData').push(ensureImmutable(result))
	});
}

// Delete Admin Functions
// ---------------------
function deleteAdminSuccess(state, result) {
	// Remove the admin the the list by ID
	return state.merge({
		adminsData: state.get('adminsData').filter((item)=> {
			return item.get('_id') !== result._id;
		})
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {
	switch (action.type) {
	case GET_JOURNAL_LOAD:
		return getJournalLoad(state);
	case GET_JOURNAL_SUCCESS:
		return getJournalSuccess(state, action.result);
	case GET_JOURNAL_FAIL:
		return getJournalFail(state, action.error);

	case UPDATE_JOURNAL_LOAD:
		return updateJournalLoad(state);
	case UPDATE_JOURNAL_SUCCESS:
		return updateJournalSuccess(state, action.result);
	case UPDATE_JOURNAL_FAIL:
		return updateJournalFail(state, action.error);

	case CREATE_COLLECTION_LOAD:
		return state;
	case CREATE_COLLECTION_SUCCESS:
		return createCollectionSuccess(state, action.result);
	case CREATE_COLLECTION_FAIL:
		return state;

	case DELETE_COLLECTION_LOAD:
		return state;
	case DELETE_COLLECTION_SUCCESS:
		return deleteCollectionSuccess(state, action.result);
	case DELETE_COLLECTION_FAIL:
		return state;

	case UPDATE_COLLECTION_LOAD:
		return state;
	case UPDATE_COLLECTION_SUCCESS:
		return updateCollectionSuccess(state, action.result);
	case UPDATE_COLLECTION_FAIL:
		return state;

	case FEATURE_ATOM_LOAD:
		return state;
	case FEATURE_ATOM_SUCCESS:
		return featureAtomSuccess(state, action.result);
	case FEATURE_ATOM_FAIL:
		return state;

	case REJECT_ATOM_LOAD:
		return state;
	case REJECT_ATOM_SUCCESS:
		return rejectAtomSuccess(state, action.result);
	case REJECT_ATOM_FAIL:
		return state;

	case ADD_ADMIN_LOAD:
		return state;
	case ADD_ADMIN_SUCCESS:
		return addAdminSuccess(state, action.result);
	case ADD_ADMIN_FAIL:
		return state;

	case DELETE_ADMIN_LOAD:
		return state;
	case DELETE_ADMIN_SUCCESS:
		return deleteAdminSuccess(state, action.result);
	case DELETE_ADMIN_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
