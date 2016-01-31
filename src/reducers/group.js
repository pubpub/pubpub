import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_GROUP_LOAD,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
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
	error: null
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function createLoad(state) {
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

	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');

	const outputState = {
		status: 'loaded',
		groupData: { ...defaultState.get('groupData'),
			groupName: 'Error Loading User',
		},
		error: error
	};

	return state.merge(outputState);
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

	default:
		return ensureImmutable(state);
	}
}
