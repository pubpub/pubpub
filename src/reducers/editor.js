import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {TOGGLE_VIEW_MODE, TOGGLE_FORMATTING, TOGGLE_TOC, LOAD_PUB_EDIT, LOAD_PUB_EDIT_SUCCESS, LOAD_PUB_EDIT_FAIL} from '../actions/editor';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	pubEditData: {},
	viewMode: 'edit', // or 'preview'
	showBottomLeftMenu: true,
	showBottomRightMenu: true,
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
	let newModes = {};
	if (state.get('viewMode') === 'edit') {
		newModes = {
			viewMode: 'preview',
			showBottomRightMenu: false,
			showBottomLeftMenu: false,
		};
	} else {
		newModes = {
			viewMode: 'edit',
			showBottomRightMenu: true,
			showBottomLeftMenu: true,
		};
	}

	return state.merge(newModes);
}

function toggleFormatting(state) {
	let newModes = {};
	if (state.get('viewMode') === 'preview') {
		if (state.get('showBottomRightMenu') === false) {
			newModes = {
				showBottomRightMenu: true,
				showBottomLeftMenu: false,
			};
		} else {
			newModes = {
				showBottomRightMenu: false,
				showBottomLeftMenu: false,
			};
		}
	} else { 
		newModes = {
			showBottomRightMenu: true,
			showBottomLeftMenu: true,
		};
	}
	
	return state.merge(newModes);
}

function toggleTOC(state) {
	let newModes = {};
	if (state.get('viewMode') === 'preview') {
		if (state.get('showBottomLeftMenu') === false) {
			newModes = {
				showBottomLeftMenu: true,
				showBottomRightMenu: false,
			};
		} else {
			newModes = {
				showBottomLeftMenu: false,
				showBottomRightMenu: false,
			};
		}
	} else { 
		newModes = {
			showBottomLeftMenu: true,
			showBottomRightMenu: true,
		};
	}
	
	return state.merge(newModes);
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
	case TOGGLE_VIEW_MODE:
		return toggleViewMode(state);
	case TOGGLE_FORMATTING:
		return toggleFormatting(state);
	case TOGGLE_TOC:
		return toggleTOC(state);
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
