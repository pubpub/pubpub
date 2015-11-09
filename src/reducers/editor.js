import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {LOAD_PUB_EDIT, LOAD_PUB_EDIT_SUCCESS, LOAD_PUB_EDIT_FAIL} from '../actions/editor';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	pubEditData: {},
	viewMode: 'edit', // or 'preview'
	showBottomLeftMenu: false,
	showBottomRightMenu: false,
	status: 'loading',
	error: null

});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function toggleViewMode(state) {
	let newMode = undefined;
	if (state.get('viewMode') === 'edit') {
		newMode = 'preview';
	} else {
		newMode = 'edit';
	}
	return state.set('viewMode', newMode);
}

function load(state) {
	return state.set('status', 'loading');
}

function loadSuccess(state, result) {
	return state.merge({
		status: 'loaded',
		pubEditData: result,
		error: null
	});
}

function loadFail(state, error) {
	console.log('in loadFail');
	return state.merge({
		status: 'failed',
		pubEditData: null,
		error: error
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function editorReducer(state = defaultState, action) {
	switch (action.type) {
	case LOAD_PUB_EDIT:
		return load(state);
	case LOAD_PUB_EDIT_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_PUB_EDIT_FAIL:
		return loadFail(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
