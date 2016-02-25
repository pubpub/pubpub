import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_PUB_LOAD,
	CREATE_PUB_SUCCESS,
	CREATE_PUB_FAIL,

	CLEAR_PUB, 
	LOAD_PUB, 
	LOAD_PUB_SUCCESS, 
	LOAD_PUB_FAIL,
	
	OPEN_PUB_MODAL,
	CLOSE_PUB_MODAL,

	ADD_DISCUSSION, 
	ADD_DISCUSSION_SUCCESS, 
	ADD_DISCUSSION_FAIL,

	ADD_SELECTION,

	TOGGLE_PUB_HIGHLIGHTS,

	DISCUSSION_VOTE,
	DISCUSSION_VOTE_SUCCESS,
	DISCUSSION_VOTE_FAIL,

	ARCHIVE_DISCUSSION_LOAD,
	ARCHIVE_DISCUSSION_SUCCESS,
	ARCHIVE_DISCUSSION_FAIL,

	PUB_NAV_OUT,
	PUB_NAV_IN,


} from '../actions/pub';

import {
	SUBMIT_PUB_TO_JOURNAL,
	SUBMIT_PUB_TO_JOURNAL_SUCCESS,
	SUBMIT_PUB_TO_JOURNAL_FAIL,
} from '../actions/journal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	createPubData: {
		pubCreated: false,
		status: 'loaded',
		error: null,
		slug: null,
		title: undefined,
	},
	pubData: {
		assets: {},
		references: {},
		discussions: [],
		readNext: [],
		featuredIn: [],
		submittedTo: [],
		reviews: [],
		experts: {approved: []},
		history: [{}],
		pubErrorView: false,
	},
	activeModal: undefined,
	newDiscussionData: {
		selections: {},
		assets: {},
		references: {},
	},
	addDiscussionStatus: 'loaded',
	activeSaveID: null,
	status: 'loading',
	error: null,
	showPubHighlights: true,
	
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function createPubLoad(state) {
	return state.mergeIn(['createPubData'], {
		status: 'loading',
		error: null,
		slug: null,
	});
}

function createPubLoadSuccess(state, result, title) {
	return state.mergeIn(['createPubData'], {
		status: 'loaded',
		error: null,
		pubCreated: true,
		slug: result,
		title: title,
	});
}

function createPubLoadFail(state, error) {
	return state.mergeIn(['createPubData'], {
		status: 'loaded',
		error: error,
	});
}

function clearPub(state) {
	return state.merge(defaultState.toJS());
}

function load(state) {
	return state.merge({
		status: 'loading',
		pubData: defaultState.toJS().pubData,
	});
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		pubData: result,
		error: null
	};

	if (result.message === 'Pub Not Found') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Pub Not Found'}],
			slug: result.slug,
			pubErrorView: true,
		};
	}

	if (result.message === 'Private Pub') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Private Pub'}],
			slug: result.slug,
			pubErrorView: true,
		};
	}

	if (result.message === 'Pub not yet published') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Pub not yet published'}],
			slug: result.slug,
			pubErrorView: true,
		};
	} 

	if (result.message === 'Pub not in this journal') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Pub not in this journal', markdown: '[Available on PubPub](http://www.pubpub.org/pub/' + result.slug + ')', styleScoped: '#pubContent a {text-align: center; color: #555; padding: 15px 0px; display: block; font-size: 1.2em; margin: 10px auto; background-color: #F6F6F6; width: 75%; border-radius: 2px; text-decoration: none;}'}],
			slug: result.slug,
			pubErrorView: true,
		};
	} 
    
	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');
	const outputState = {
		status: 'loaded',
		pubData: { ...defaultState.get('pubData'),
			history: [{title: 'Error Loading Pub'}],
			pubErrorView: true,
		},
		error: error,
	};

	return state.merge(outputState);
}

function openPubModal(state, modal) {
	return state.merge({
		activeModal: modal,
	});
}

function closePubModal(state) {
	return state.merge({
		activeModal: undefined,
	});
}

function addDiscussionLoad(state, activeSaveID) {
	return state.merge({
		addDiscussionStatus: 'loading',
		activeSaveID: activeSaveID,
	});
}

function addDiscussionSuccess(state, result, activeSaveID, inEditor) {
	if (inEditor) {return state;}
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

	let discussionsObject = state.getIn(['pubData', 'discussions']);
	if (!result.parent) {
		discussionsObject = discussionsObject.unshift(result);
	} else {
		// We have a parent, we gotta go find it and then merge inside of it
		const discussionsArray = discussionsObject.toJS();
		findParentAndAdd(discussionsArray, result.parent, result);
		discussionsObject = discussionsArray;
	}
	const newState = state.mergeIn(['pubData', 'discussions'], discussionsObject);

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

function addSelection(state, selection) {
	const selectionData = state.getIn(['newDiscussionData', 'selections']);
	return state.mergeIn(
		['newDiscussionData', 'selections'], 
		selectionData.set(selectionData.size + 1, selection)
	);
}

function togglePubHighlights(state) {
	return state.set('showPubHighlights', !state.get('showPubHighlights'));
}

function pubNavOut(state) {
	return state.merge({
		status: 'loading',
	});
}

function pubNavIn(state) {
	return state.merge({
		status: 'loaded',
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

	const discussionsArray = state.getIn(['pubData', 'discussions']).toJS();
	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubData', 'discussions'], discussionsArray);
}

function archiveDiscussion(state, discussionID) {

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

	const discussionsArray = state.getIn(['pubData', 'discussions']).toJS();
	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubData', 'discussions'], discussionsArray);
}

function submitPubToJournalSuccess(state, journalData) {
	const outputObject = state.get('pubData').toJS();
	if (!outputObject.submittedTo || !outputObject.submittedToList) {
		return state;
	}

	outputObject.submittedTo.push({
		journal: journalData,
		date: new Date().getTime(),
	});
	outputObject.submittedToList.push(journalData._id);

	return state.merge({
		pubData: outputObject
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_PUB_LOAD:
		return createPubLoad(state);
	case CREATE_PUB_SUCCESS:
		return createPubLoadSuccess(state, action.result, action.title);
	case CREATE_PUB_FAIL:
		return createPubLoadFail(state, action.error);

	case CLEAR_PUB:
		return clearPub(state);
	case LOAD_PUB:
		return load(state);
	case LOAD_PUB_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_PUB_FAIL:
		return loadFail(state, action.error);

	case OPEN_PUB_MODAL:
		return openPubModal(state, action.modal);
	case CLOSE_PUB_MODAL:
		return closePubModal(state);

	case ADD_DISCUSSION:
		return addDiscussionLoad(state, action.activeSaveID);
	case ADD_DISCUSSION_SUCCESS:
		return addDiscussionSuccess(state, action.result, action.activeSaveID, action.inEditor);
	case ADD_DISCUSSION_FAIL:
		return addDiscussionFail(state, action.error, action.activeSaveID);

	case ADD_SELECTION:
		return addSelection(state, action.selection);

	case PUB_NAV_OUT:
		return pubNavOut(state);
	case PUB_NAV_IN:
		return pubNavIn(state);

	case TOGGLE_PUB_HIGHLIGHTS:
		return togglePubHighlights(state);

	case DISCUSSION_VOTE:
		return discussionVote(state, action.voteType, action.discussionID, action.userYay, action.userNay);
	case DISCUSSION_VOTE_SUCCESS:
		return state;
	case DISCUSSION_VOTE_FAIL:
		return state;

	case ARCHIVE_DISCUSSION_LOAD:
		return archiveDiscussion(state, action.objectID);
	case ARCHIVE_DISCUSSION_SUCCESS:
		return state;
	case ARCHIVE_DISCUSSION_FAIL:
		return state;

	case SUBMIT_PUB_TO_JOURNAL:
		return state;
	case SUBMIT_PUB_TO_JOURNAL_SUCCESS:
		return submitPubToJournalSuccess(state, action.journalData);
	case SUBMIT_PUB_TO_JOURNAL_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
