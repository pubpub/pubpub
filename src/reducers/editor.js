import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	TOGGLE_VIEW_MODE, 
	SET_VIEW_MODE, 
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

	SAVE_STYLE_LOAD,
	SAVE_STYLE_SUCCESS,
	SAVE_STYLE_FAIL,

	UPDATE_PUB_BACKEND_DATA_LOAD,
	UPDATE_PUB_BACKEND_DATA_SUCCESS,
	UPDATE_PUB_BACKEND_DATA_FAIL,

	PUBLISH_LOAD,
	PUBLISH_SUCCESS,
	PUBLISH_FAIL,

	ADD_SELECTION,

	DISCUSSION_VOTE,
	DISCUSSION_VOTE_SUCCESS,
	DISCUSSION_VOTE_FAIL,

	ARCHIVE_COMMENT_LOAD,
	ARCHIVE_COMMENT_SUCCESS,
	ARCHIVE_COMMENT_FAIL,

	ADD_COMMENT, 
	ADD_COMMENT_SUCCESS, 
	ADD_COMMENT_FAIL,

} from '../actions/editor';

import {

	ADD_DISCUSSION, 
	ADD_DISCUSSION_SUCCESS, 
	ADD_DISCUSSION_FAIL,

} from '../actions/pub';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	pubEditData: {
		discussions: [],
	},
	viewMode: 'edit', // or 'preview'
	showBottomLeftMenu: true,
	showBottomRightMenu: true,
	activeModal: undefined,
	status: 'loading',
	error: null,
	publishError: null,
	publishSuccess: null,
	newDiscussionData: {
		selections: {},
		assets: {},
		references: {},
	},
	styleSaving: false,
	styleScoped: null,
	styleError: null,
	addDiscussionStatus: 'loaded',
	activeSaveID: null,

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

function setViewMode(state, viewMode) {
	let newModes = {};
	if (viewMode === 'preview') {
		newModes = {
			viewMode: 'preview',
			showBottomRightMenu: false,
			showBottomLeftMenu: false,
		};
	} else if (viewMode === 'edit') {
		newModes = {
			viewMode: 'edit',
			showBottomRightMenu: true,
			showBottomLeftMenu: true,
		};
	} else if (viewMode === 'read') {
		newModes = {
			viewMode: 'read',
			showBottomRightMenu: false,
			showBottomLeftMenu: false,
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

function addSelection(state, selection) {
	const selectionData = state.getIn(['newDiscussionData', 'selections']);
	return state.mergeIn(
		['newDiscussionData', 'selections'], 
		selectionData.set(selectionData.size + 1, selection)
	);
}

function addCommentLoad(state, activeSaveID) {
	return state.merge({
		addDiscussionStatus: 'loading',
		activeSaveID: activeSaveID,
	});
}

function addCommentSuccess(state, result, activeSaveID) {
	function findParentAndAdd(discussions, parentID, newChild) {
		discussions.map((discussion)=>{
			if (discussion._id === parentID) {
				discussion.children.unshift(result);
			}
			if (discussion.children && discussion.children.length) {
				findParentAndAdd(discussion.children, parentID, newChild);
			}
		});
	}

	let discussionsObject = state.getIn(['pubEditData', 'editorComments']);
	if (!result.parent) {
		discussionsObject = discussionsObject.unshift(result);
	} else {
		// We have a parent, we gotta go find it and then merge inside of it
		const discussionsArray = discussionsObject.toJS();
		findParentAndAdd(discussionsArray, result.parent, result);
		discussionsObject = discussionsArray;
	}
	const newState = state.mergeIn(['pubEditData', 'editorComments'], discussionsObject);
	return newState.merge({
		addDiscussionStatus: 'loaded',
		activeSaveID: null,
		newDiscussionData: {
			selections: {},
			assets: {},
			references: {},
		},
	});
}

function addCommentFail(state, error, activeSaveID) {
	console.log(error);
	return state.merge({
		addDiscussionStatus: 'error',
		activeSaveID: activeSaveID,
	});
}

function addDiscussionLoad(state, activeSaveID) {
	return state.merge({
		addDiscussionStatus: 'loading',
		activeSaveID: activeSaveID,
	});
}

function addDiscussionSuccess(state, result, activeSaveID, inEditor) {
	if (!inEditor) {return state;}
	function findParentAndAdd(discussions, parentID, newChild) {
		discussions.map((discussion)=>{
			if (discussion._id === parentID) {
				discussion.children.unshift(result);
			}
			if (discussion.children && discussion.children.length) {
				findParentAndAdd(discussion.children, parentID, newChild);
			}
		});
	}

	let discussionsObject = state.getIn(['pubEditData', 'discussions']);
	if (!result.parent) {
		discussionsObject = discussionsObject.unshift(result);
	} else {
		// We have a parent, we gotta go find it and then merge inside of it
		const discussionsArray = discussionsObject.toJS();
		findParentAndAdd(discussionsArray, result.parent, result);
		discussionsObject = discussionsArray;
	}
	const newState = state.mergeIn(['pubEditData', 'discussions'], discussionsObject);

	return newState.merge({
		addDiscussionStatus: 'loaded',
		activeSaveID: null,
		newDiscussionData: {
			selections: {},
			assets: {},
			references: {},
		},
	});
}

function addDiscussionFail(state, error, activeSaveID) {
	console.log(error);
	return state.merge({
		addDiscussionStatus: 'error',
		activeSaveID: activeSaveID,
	});
}

function discussionVote(state, voteType, discussionID, userYay, userNay) {
	
	let scoreChange = 0;
	let newUserYay = undefined;
	let newUserNay = undefined;

	if (voteType === 'yay' && !userYay) {
		scoreChange = userNay ? 2 : 1;
		newUserYay = true;
	} else if (voteType === 'yay' && userYay) {
		scoreChange = -1;
		newUserYay = false;
	} else if (voteType === 'nay' && !userNay) {
		scoreChange = userYay ? 2 : 1;
		newUserNay = true;
	} else if (voteType === 'nay' && userNay) {
		scoreChange = -1;
		newUserNay = false;
	}
	// Find the discussion with result._id
	// update the yays
	// update the nays
	// update useryay
	// update usernay

	function findDiscussionAndChange(discussions) {
		discussions.map((discussion)=>{
			if (discussion._id === discussionID) {
				discussion[voteType === 'yay' ? 'yays' : 'nays'] += scoreChange;
				discussion.points += (voteType === 'yay' ? 1 : -1) * scoreChange;
				discussion.userYay = newUserYay;
				discussion.userNay = newUserNay;
			}
			if (discussion.children && discussion.children.length) {
				findDiscussionAndChange(discussion.children);
			}
		});
	}

	const discussionsArray = state.getIn(['pubEditData', 'editorComments']).toJS();

	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubEditData', 'editorComments'], discussionsArray);
}

function archiveComment(state, discussionID) {

	function findDiscussionAndChange(discussions) {
		discussions.map((discussion)=>{
			if (discussion._id === discussionID) {
				discussion.archived = !discussion.archived;
			}
			if (discussion.children && discussion.children.length) {
				findDiscussionAndChange(discussion.children);
			}
		});
	}

	const discussionsArray = state.getIn(['pubEditData', 'editorComments']).toJS();
	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubEditData', 'editorComments'], discussionsArray);
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

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function editorReducer(state = defaultState, action) {
	switch (action.type) {
	case TOGGLE_VIEW_MODE:
		return toggleViewMode(state);
	case SET_VIEW_MODE:
		return setViewMode(state, action.viewMode);
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

	case UPDATE_PUB_BACKEND_DATA_LOAD:
		return state;
	case UPDATE_PUB_BACKEND_DATA_SUCCESS:
		return updateBackendSuccess(state, action.result);
	case UPDATE_PUB_BACKEND_DATA_FAIL:
		return state;

	case ADD_SELECTION:
		return addSelection(state, action.selection);

	case PUBLISH_LOAD:
		return publishLoad(state);
	case PUBLISH_SUCCESS:
		return publishSuccess(state, action.result);
	case PUBLISH_FAIL:
		return publishError(state, action.error);

	case DISCUSSION_VOTE:
		return discussionVote(state, action.voteType, action.discussionID, action.userYay, action.userNay);
	case DISCUSSION_VOTE_SUCCESS:
		return state;
	case DISCUSSION_VOTE_FAIL:
		return state;

	case ARCHIVE_COMMENT_LOAD:
		return archiveComment(state, action.objectID);
	case ARCHIVE_COMMENT_SUCCESS:
		return state;
	case ARCHIVE_COMMENT_FAIL:
		return state;

	case SAVE_STYLE_LOAD:
		return saveStyleLoad(state);
	case SAVE_STYLE_SUCCESS:
		return saveStyleSuccess(state, action.result);
	case SAVE_STYLE_FAIL:
		return saveStyleError(state, action.error);
		
	case ADD_COMMENT:
		return addCommentLoad(state, action.activeSaveID);
	case ADD_COMMENT_SUCCESS:
		return addCommentSuccess(state, action.result, action.activeSaveID);
	case ADD_COMMENT_FAIL:
		return addCommentFail(state, action.error, action.activeSaveID);

	case ADD_DISCUSSION:
		return addDiscussionLoad(state, action.activeSaveID);
	case ADD_DISCUSSION_SUCCESS:
		return addDiscussionSuccess(state, action.result, action.activeSaveID, action.inEditor);
	case ADD_DISCUSSION_FAIL:
		return addDiscussionFail(state, action.error, action.activeSaveID);

	default:
		return ensureImmutable(state);
	}
}
