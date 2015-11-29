import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {TOGGLE_VIEW_MODE, 
	TOGGLE_FORMATTING, 
	TOGGLE_TOC, 
	LOAD_PUB_EDIT, 
	LOAD_PUB_EDIT_SUCCESS, 
	LOAD_PUB_EDIT_FAIL, 
	PUB_EDIT_UNMOUNT,
	MODAL_OPEN,
	MODAL_CLOSE,
	UPDATE_COLLABORATORS_LOAD,
	UPDATE_COLLABORATORS_SUCCESS,
	UPDATE_COLLABORATORS_FAIL,

	UPDATE_PUB_SETTINGS_LOAD,
	UPDATE_PUB_SETTINGS_SUCCESS,
	UPDATE_PUB_SETTINGS_FAIL,
	PUBLISH_LOAD,
	PUBLISH_SUCCESS,
	PUBLISH_FAIL,
} from '../actions/editor';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	pubEditData: {},
	viewMode: 'edit', // or 'preview'
	showBottomLeftMenu: true,
	showBottomRightMenu: true,
	activeModal: undefined,
	status: 'loading',
	error: null,
	publishError: null,
	publishSuccess: null,

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
	const outputState = {
		status: 'loaded',
		pubEditData: result,
		error: null
	};

	if (result === 'Pub Not Found') {
		outputState.pubEditData = { ...defaultState.get('pubEditData'),
			title: 'Pub Not Found',
		};
		outputState.error = true;
		outputState.status = 'loading';
	}

	if (result === 'Not Authorized') {
		outputState.pubEditData = { ...defaultState.get('pubEditData'),
			title: 'Not Authorized',
		};
		outputState.error = true;
		outputState.status = 'loading';
	}

	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');
	return state.merge({
		status: 'loading',
		pubEditData: { ...defaultState.get('pubEditData'),
			title: 'Error Loading Pub',
		},
		error: error
	});
}

function unmountEditor() {
	return defaultState;
}

function openModal(state, activeModal) {
	const nextModal = (activeModal !== state.get('activeModal')) ? activeModal : undefined;
	return state.merge({
		activeModal: nextModal,
	});
}

function closeModal(state) {
	return state.merge({
		activeModal: undefined,
	});
}

function publishLoad(state) {
	return state;
}

// function publishSuccess(state, result) {
function publishSuccess(state) {
	return state.merge({
		publishSuccess: true,
	});
}

function publishError(state, error) {
	return state.merge({
		publishError: error,
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
	case PUB_EDIT_UNMOUNT:
		return unmountEditor();
		
	case MODAL_OPEN: 
		return openModal(state, action.activeModal);
	case MODAL_CLOSE: 
		return closeModal(state);

	case UPDATE_COLLABORATORS_LOAD:
		return state;
	case UPDATE_COLLABORATORS_SUCCESS:
		return state;
	case UPDATE_COLLABORATORS_FAIL:
		return state;

	case UPDATE_PUB_SETTINGS_LOAD:
		return state;
	case UPDATE_PUB_SETTINGS_SUCCESS:
		return state;
	case UPDATE_PUB_SETTINGS_FAIL:
		return state;

	case PUBLISH_LOAD:
		return publishLoad(state);
	case PUBLISH_SUCCESS:
		return publishSuccess(state, action.result);
	case PUBLISH_FAIL:
		return publishError(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
