import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {LOAD_PUB, 
	LOAD_PUB_SUCCESS, 
	LOAD_PUB_FAIL,

	// MODAL_OPEN,
	// MODAL_CLOSE,
} from '../actions/reader';

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
		experts: [],
		history: [{}],
	},
	// activeModal: undefined,
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function load(state) {
	return state.set('status', 'loading');
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		pubData: result,
		// activePubData: {
		// 	title: result.title,
		// 	abstract: result.abstract,
		// 	authorsNote: result.authorsNote,
		// 	markdown: result.markdown,
		// 	authors: result.authors,
		// 	assets: result.assets,
		// 	references: result.references,
		// 	style: result.style,
		// 	lastUpdated: result.lastUpdated,
		// 	status: result.status,
		// 	mostRecentVersion: true,
		// },
		error: null
	};

	if (result === 'Pub Not Found') {
		outputState.pubData = { ...defaultState.get('pubData'),
			title: 'Pub Not Found',
		};
		// outputState.activePubData = { ...outputState.pubData};
	}

	if (result === 'Private Pub') {
		outputState.pubData = { ...defaultState.get('pubData'),
			title: 'Private Pub',
		};
		// outputState.activePubData = { ...outputState.pubData};
	}

	if (result === 'Pub not yet published') {
		outputState.pubData = { ...defaultState.get('pubData'),
			title: 'Pub not yet published',
		};
		// outputState.activePubData = { ...outputState.pubData};
	} 

	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');
	const outputState = {
		status: 'loaded',
		pubData: { ...defaultState.get('pubData'),
			title: 'Error Loading Pub',
		},
		error: error,
	};

	return state.merge(outputState);
}

// function openModal(state, activeModal) {
// 	return state.merge({
// 		activeModal: activeModal,
// 	});
// }

// function closeModal(state) {
// 	return state.merge({
// 		activeModal: undefined,
// 	});
// }

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_PUB:
		return load(state);
	case LOAD_PUB_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_PUB_FAIL:
		return loadFail(state, action.error);

	// case MODAL_OPEN: 
	// 	return openModal(state, action.activeModal);
	// case MODAL_CLOSE: 
	// 	return closeModal(state);
		
	default:
		return ensureImmutable(state);
	}
}
