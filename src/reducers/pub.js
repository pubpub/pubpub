import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CLEAR_PUB, 
	LOAD_PUB, 
	LOAD_PUB_SUCCESS, 
	LOAD_PUB_FAIL,
	
	OPEN_PUB_MODAL,
	CLOSE_PUB_MODAL,

	ADD_DISCUSSION, 
	ADD_DISCUSSION_SUCCESS, 
	ADD_DISCUSSION_FAIL,
} from '../actions/pub';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
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
	addDiscussionStatus: 'loaded',
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function clearPub(state) {
	console.log('in clearPub');
	return state.merge(defaultState.toJS());
}

function load(state) {
	return state.merge({
		status: 'loading',
		pubdata: defaultState.toJS(),
	});
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		pubData: result,
		error: null
	};

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

function addDiscussionLoad(state) {
	return state.merge({
		addDiscussionStatus: 'loading',
	});
}

function addDiscussionSuccess(state, result) {
	let discussionsObject = state.getIn(['pubData', 'discussions']);
	if (!result.parent) {
		discussionsObject = discussionsObject.unshift(result);
	} else {
		// We have a parent, we gotta go find it and then merge inside of it
	}

	const newState = state.mergeIn(['pubData', 'discussions'], discussionsObject);
	return newState.merge({
		addDiscussionStatus: 'loaded',
	});
}

function addDiscussionFail(state, error) {
	console.log(error);
	return state.merge({
		addDiscussionStatus: 'loaded',
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
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
		return addDiscussionLoad(state);
	case ADD_DISCUSSION_SUCCESS:
		return addDiscussionSuccess(state, action.result);
	case ADD_DISCUSSION_FAIL:
		return addDiscussionFail(state, action.error);
		
	default:
		return ensureImmutable(state);
	}
}
