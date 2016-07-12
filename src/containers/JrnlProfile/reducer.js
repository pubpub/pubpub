import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_JRNL_LOAD,
	GET_JRNL_SUCCESS,
	GET_JRNL_FAIL,

	UPDATE_JRNL_LOAD,
	UPDATE_JRNL_SUCCESS,
	UPDATE_JRNL_FAIL,

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
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	jrnlData: {},
	submittedData: [],
	featuredData: [],
	collectionData: [],
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


// Get Jrnl Functions
// ---------------------
function getJrnlLoad(state) {
	return state.set('loading', true);
}

function getJrnlSuccess(state, result) {
	return state.merge({
		jrnlData: result.jrnlData,
		submittedData: result.submittedData,
		featuredData: result.featuredData,
		collectionData: result.collectionData,
		loading: false,
		error: null,
	});
}

function getJrnlFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}


// Update Jrnl Functions
// ---------------------
function updateJrnlLoad(state) {
	return state.set('saveLoading', true);
}

function updateJrnlSuccess(state, result) {
	return state.merge({
		jrnlData: result,
		saveLoading: false,
		saveError: null,
	});
}

function updateJrnlFail(state, error) {
	return state.merge({
		saveLoading: false,
		saveError: error,
	});
}

// Create Collection Functions
// ---------------------
function createCollectionSuccess(state, result) {
	const newCollections = [result].concat(state.getIn(['jrnlData', 'collections']).toJS());
	return state.mergeIn(['jrnlData', 'collections'], newCollections);
}

// Update Collection Functions
// ---------------------
function updateCollectionSuccess(state, result) {
	const newCollections = state.getIn(['jrnlData', 'collections']).map((item)=>{
		if (item.get('_id') === result._id) { return ensureImmutable(result); }
		return item;
	});
	return state.setIn(['jrnlData', 'collections'], newCollections);
}


// Delete Collection Functions
// ---------------------
function deleteCollectionSuccess(state, result) {
	const newCollections = state.getIn(['jrnlData', 'collections']).filter((item)=>{
		return item.get('_id') !== result;
	});
	return state.setIn(['jrnlData', 'collections'], newCollections);
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

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {
	switch (action.type) {
	case GET_JRNL_LOAD:
		return getJrnlLoad(state);
	case GET_JRNL_SUCCESS:
		return getJrnlSuccess(state, action.result);
	case GET_JRNL_FAIL:
		return getJrnlFail(state, action.error);

	case UPDATE_JRNL_LOAD:
		return updateJrnlLoad(state);
	case UPDATE_JRNL_SUCCESS:
		return updateJrnlSuccess(state, action.result);
	case UPDATE_JRNL_FAIL:
		return updateJrnlFail(state, action.error);

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

	default:
		return ensureImmutable(state);
	}
}
