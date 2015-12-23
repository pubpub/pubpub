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

	DISCUSSION_VOTE,
	DISCUSSION_VOTE_SUCCESS,
	DISCUSSION_VOTE_FAIL,

} from '../actions/pub';

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
	error: null
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
	console.log('in clear pub');
	return state.merge(defaultState.toJS());
}

function load(state) {
	console.log('in load pub');
	return state.merge({
		status: 'loading',
		pubData: defaultState.toJS(),
	});
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		pubData: result,
		error: null
	};
	console.log('in load success pub');

	if (result === 'Pub Not Found') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Pub Not Found'}],
		};
	}

	if (result === 'Private Pub') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Private Pub'}],
		};
	}

	if (result === 'Pub not yet published') {
		outputState.pubData = { ...defaultState.get('pubData'),
			history: [{title: 'Pub not yet published'}],
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

function addDiscussionSuccess(state, result, activeSaveID) {
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
		return addDiscussionSuccess(state, action.result, action.activeSaveID);
	case ADD_DISCUSSION_FAIL:
		return addDiscussionFail(state, action.error, action.activeSaveID);

	case ADD_SELECTION:
		return addSelection(state, action.selection);

	case DISCUSSION_VOTE:
		return discussionVote(state, action.voteType, action.discussionID, action.userYay, action.userNay);
	case DISCUSSION_VOTE_SUCCESS:
		// return discussionVoteSuccess(state, action.result);
		return state;
	case DISCUSSION_VOTE_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
