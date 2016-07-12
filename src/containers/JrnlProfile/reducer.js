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
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	jrnlData: {},
	submittedData: [],
	featuredData: [],
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
function createCollectionLoad(state) {
	return state;
}

function createCollectionSuccess(state, result) {
	console.log([result]);
	console.log(state.getIn(['jrnlData', 'collections']).toJS());
	console.log([result].concat(state.getIn(['jrnlData', 'collections']).toJS()));
	const newCollections = [result].concat(state.getIn(['jrnlData', 'collections']).toJS());
	// console.lg
	return state.mergeIn(['jrnlData', 'collections'], newCollections);
}

function createCollectionFail(state, error) {
	console.log('Error in createCollectionFail', error);
	return state;
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
		return createCollectionLoad(state);
	case CREATE_COLLECTION_SUCCESS:
		return createCollectionSuccess(state, action.result);
	case CREATE_COLLECTION_FAIL:
		return createCollectionFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
