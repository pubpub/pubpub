/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD_PUB_EDIT = 'editor/LOAD_PUB_EDIT';
export const LOAD_PUB_EDIT_SUCCESS = 'editor/LOAD_PUB_EDIT_SUCCESS';
export const LOAD_PUB_EDIT_FAIL = 'editor/LOAD_PUB_EDIT_FAIL';
export const TOGGLE_VIEW_MODE = 'editor/TOGGLE_VIEW_MODE';
export const SET_VIEW_MODE = 'editor/SET_VIEW_MODE';
export const TOGGLE_FORMATTING = 'editor/TOGGLE_FORMATTING';
export const TOGGLE_TOC = 'editor/TOGGLE_TOC';

export const MODAL_CLOSE = 'editor/MODAL_CLOSE';
export const MODAL_OPEN = 'editor/MODAL_OPEN';

export const PUB_EDIT_UNMOUNT = 'editor/PUB_EDIT_UNMOUNT';

export const ADD_SELECTION = 'editor/ADD_SELECTION';

export const ADD_COMMENT = 'pub/ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'pub/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAIL = 'pub/ADD_COMMENT_FAIL';

export const UPDATE_COLLABORATORS_LOAD = 'editor/UPDATE_COLLABORATORS_LOAD';
export const UPDATE_COLLABORATORS_SUCCESS = 'editor/UPDATE_COLLABORATORS_SUCCESS';
export const UPDATE_COLLABORATORS_FAIL = 'editor/UPDATE_COLLABORATORS_FAIL';

export const UPDATE_PUB_SETTINGS_LOAD = 'editor/UPDATE_PUB_SETTINGS_LOAD';
export const UPDATE_PUB_SETTINGS_SUCCESS = 'editor/UPDATE_PUB_SETTINGS_SUCCESS';
export const UPDATE_PUB_SETTINGS_FAIL = 'editor/UPDATE_PUB_SETTINGS_FAIL';

export const PUBLISH_LOAD = 'editor/PUBLISH_LOAD';
export const PUBLISH_SUCCESS = 'editor/PUBLISH_SUCCESS';
export const PUBLISH_FAIL = 'editor/PUBLISH_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPubEdit(slug) {
	return {
		types: [LOAD_PUB_EDIT, LOAD_PUB_EDIT_SUCCESS, LOAD_PUB_EDIT_FAIL],
		promise: (client) => client.get('/getPubEdit', {params: {slug: slug}}) 
	};
}

export function publishVersion(newVersion) {
	return {
		types: [PUBLISH_LOAD, PUBLISH_SUCCESS, PUBLISH_FAIL],
		promise: (client) => client.post('/publishPub', {data: {newVersion: newVersion}}) 
	};
}

export function toggleEditorViewMode() {
	return {
		type: TOGGLE_VIEW_MODE
	};
}

export function setEditorViewMode(viewMode) {
	return {
		type: SET_VIEW_MODE,
		viewMode: viewMode
	};
}

export function toggleFormatting() {
	return {
		type: TOGGLE_FORMATTING
	};
}

export function toggleTOC() {
	return {
		type: TOGGLE_TOC
	};
}

export function unmountEditor() {
	return {
		type: PUB_EDIT_UNMOUNT
	};
}

export function closeModal() {
	return {
		type: MODAL_CLOSE
	};
}

export function openModal(activeModal) {
	document.getElementById('modal-container').scrollTop = 0;
	return {
		type: MODAL_OPEN,
		activeModal: activeModal
	};
}

export function addSelection(selection) {
	return {
		type: ADD_SELECTION,
		selection: selection,
	};	
}

export function saveCollaboratorsToPub(newCollaborators, removedUser, slug) {
	return {
		types: [UPDATE_COLLABORATORS_LOAD, UPDATE_COLLABORATORS_SUCCESS, UPDATE_COLLABORATORS_FAIL],
		promise: (client) => client.post('/updateCollaborators', {data: {
			newCollaborators: newCollaborators,
			removedUser: removedUser,
			slug: slug
		}}) 
	};
}

export function saveSettingsPubPub(slug, newSettings) {
	return {
		types: [UPDATE_PUB_SETTINGS_LOAD, UPDATE_PUB_SETTINGS_SUCCESS, UPDATE_PUB_SETTINGS_FAIL],
		promise: (client) => client.post('/updatePubSettings', {data: {
			slug: slug,
			newSettings: newSettings
		}}) 
	};
}

export function addComment(discussionObject, activeSaveID) {
	return {
		types: [ADD_COMMENT, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAIL],
		promise: (client) => client.post('/addDiscussion', {data: {discussionObject: discussionObject, isEditorComment: true}}),
		activeSaveID: activeSaveID 
	};
}
