import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_GROUP_LOAD,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,

	LOAD_GROUP_LOAD,
	LOAD_GROUP_SUCCESS,
	LOAD_GROUP_FAIL,

	SAVE_GROUP_LOAD,
	SAVE_GROUP_SUCCESS,
	SAVE_GROUP_FAIL,

} from '../actions/group';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	createGroupData: {
		groupCreated: false,
		status: 'loaded',
		error: null,
		groupSlug: null,	
	},
	groupData: {
		pubs: [],
		discussions: [],
	},
	status: 'loading',
	settingsStatus: 'saved',
	error: null,
	groupSaving: false,
	groupSavingError: null,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function createLoad(state) {
	return state.mergeIn(['createGroupData'], {
		status: 'loading',
		error: null,
		groupSlug: null,
	});
}

function createSuccess(state, result) {

	return state.mergeIn(['createGroupData'], {
		status: 'loaded',
		error: null,
		groupCreated: true,
		groupSlug: result,
	});
}

function createFail(state, error) {
	return state.mergeIn(['createGroupData'], {
		status: 'loaded',
		error: error,
	});
}

function load(state) {
	return state.merge({
		status: 'loading',
		groupData: {
			pubs: [],
		},
	});
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		groupData: result,
		error: null
	};

	if (result === 'Group Not Found') {
		outputState.groupData = { ...defaultState.get('groupData'),
			groupName: 'Group Not Found',
		};
	}

	if (result === 'Not Authorized') {
		outputState.groupData = { ...defaultState.get('groupData'),
			groupName: 'Not Authorized',
		};
	}
	
	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');

	const outputState = {
		status: 'loaded',
		groupData: { ...defaultState.get('groupData'),
			groupName: 'Error Loading Group',
		},
		error: error
	};

	return state.merge(outputState);
}

function saveGroupLoad(state) {
	return state.set('groupSaving', true);
}

function saveGroupSuccess(state, groupData) {
	return state.merge({
		groupSaving: false,
		groupSavingError: null,
		groupData
	});
}

function saveGroupFail(state, error) {	
	return state.merge({
		groupSaving: false,
		groupSavingError: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function profileReducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_GROUP_LOAD:
		return createLoad(state);
	case CREATE_GROUP_SUCCESS:
		return createSuccess(state, action.result);
	case CREATE_GROUP_FAIL:
		return createFail(state, action.error);

	case LOAD_GROUP_LOAD:
		return load(state);
	case LOAD_GROUP_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_GROUP_FAIL:
		return loadFail(state, action.error);

	case SAVE_GROUP_LOAD:
		return saveGroupLoad(state);
	case SAVE_GROUP_SUCCESS:
		return saveGroupSuccess(state, action.result);
	case SAVE_GROUP_FAIL:
		return saveGroupFail(state, action.error);


	default:
		return ensureImmutable(state);
	}
}
