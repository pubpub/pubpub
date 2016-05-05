import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	TOGGLE_VIEW_MODE,
	SET_VIEW_MODE,

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

	SAVE_STYLE_LOAD,
	SAVE_STYLE_SUCCESS,
	SAVE_STYLE_FAIL,

	UPDATE_PUB_BACKEND_DATA_LOAD,
	UPDATE_PUB_BACKEND_DATA_SUCCESS,
	UPDATE_PUB_BACKEND_DATA_FAIL,

	SAVE_VERSION_LOAD,
	SAVE_VERSION_SUCCESS,
	SAVE_VERSION_FAIL,
	WAIT_FOR_UPLOAD,
	STOP_WAIT_FOR_UPLOAD,

} from './actions';

import {
	CREATE_ASSET_SUCCESS
} from '../MediaLibrary/actions';

/*--------*/
// Initialize Default State
/*--------*/
const defaultState = Immutable.Map({
	pubEditData: {
		discussions: [],
	},
	viewMode: 'edit', // or 'preview'
	activeModal: undefined,
	status: 'loading',
	error: null,
	saveVersionError: null,
	saveVersionSuccess: null,
	styleSaving: false,
	styleScoped: null,
	styleError: null,
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

function setViewMode(state, viewMode) {
	let newModes = {};
	if (viewMode === 'preview') {
		newModes = {
			viewMode: 'preview',
		};
	} else if (viewMode === 'edit') {
		newModes = {
			viewMode: 'edit',
		};
	} else if (viewMode === 'read') {
		newModes = {
			viewMode: 'read',
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

	if (result.isReader) {
		outputState.viewMode = 'read';
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
		waitForUpload: false,
	});
}

function saveVersionLoad(state) {
	return state;
}

function saveVersionSuccess(state) {
	return state.merge({
		saveVersionSuccess: true,
	});
}

function saveVersionError(state, error) {
	return state.merge({
		saveVersionError: error,
	});
}

function saveStyleLoad(state) {
	return state.merge({
		styleSaving: true,
	});
}

function saveStyleSuccess(state, result) {
	return state.merge({
		styleSaving: false,
		styleError: false,
		styleScoped: result,
	});
}

function saveStyleError(state, error) {
	return state.merge({
		styleError: error,
	});
}

// TODO: It seems like this function, if fired after the page nav has occurred, will trigger a state.get is not a function error.
function updateBackendSuccess(state, result) {
	if (!state.get('pubEditData').toJS) {
		return state;
	}
	return state.merge({
		pubEditData: {
			...state.get('pubEditData').toJS(),
			...result
		}
	});
}

function waitForUpload(state, open, assetType) {
	return state.merge({
		waitForUpload: open,
		activeModal: 'AssetsUpload',
		waitForUploadType: assetType,
	});
}

function waitForUploadSuccess(state, asset) {

	if (!state.get('waitForUpload')) {
		return state;
	}
	return state.merge({
		requestedAsset: asset,
		activeModal: undefined,
		waitForUpload: false,
	});

}


/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function editorReducer(state = defaultState, action) {
	switch (action.type) {
	case TOGGLE_VIEW_MODE:
		return toggleViewMode(state);
	case SET_VIEW_MODE:
		return setViewMode(state, action.viewMode);
	// case TOGGLE_FORMATTING:
		// return toggleFormatting(state);
	// case TOGGLE_TOC:
		// return toggleTOC(state);
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

	case UPDATE_PUB_BACKEND_DATA_LOAD:
		return state;
	case UPDATE_PUB_BACKEND_DATA_SUCCESS:
		return updateBackendSuccess(state, action.result);
	case UPDATE_PUB_BACKEND_DATA_FAIL:
		return state;

	case SAVE_VERSION_LOAD:
		return saveVersionLoad(state);
	case SAVE_VERSION_SUCCESS:
		return saveVersionSuccess(state, action.result);
	case SAVE_VERSION_FAIL:
		return saveVersionError(state, action.error);

	case SAVE_STYLE_LOAD:
		return saveStyleLoad(state);
	case SAVE_STYLE_SUCCESS:
		return saveStyleSuccess(state, action.result);
	case SAVE_STYLE_FAIL:
		return saveStyleError(state, action.error);

	case WAIT_FOR_UPLOAD:
		return waitForUpload(state, true, action.assetType);
	case STOP_WAIT_FOR_UPLOAD:
		return waitForUpload(state, false);

	case CREATE_ASSET_SUCCESS:
		return waitForUploadSuccess(state, action.result);

	default:
		return ensureImmutable(state);
	}
}
