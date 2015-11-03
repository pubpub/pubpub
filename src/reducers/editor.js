import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {NARROW, LOAD, LOAD_SUCCESS, LOAD_FAIL} from '../actions/editor';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	narrowMode: 'wide',
	sampleOutput: Immutable.List()
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function narrow(state) {
	let newMode = undefined;
	if (state.get('narrowMode') === 'narrow') {
		newMode = 'wide';
	} else {
		newMode = 'narrow';
	}
	return state.set('narrowMode', newMode);
}

function load(state) {
	console.log('in load');
	return state.set('loading', 50);
}

function loadSuccess(state, result) {
	console.log('in loadSuccess');
	return state.merge({
		loading: 100,
		loaded: true,
		sampleOutput: result,
		error: null
	});
}

function loadFail(state, error) {
	console.log('in loadFail');
	return state.merge({
		loading: false,
		loaded: false,
		data: null,
		error: error
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function editorReducer(state = defaultState, action) {
	switch (action.type) {
	case LOAD:
		console.log('in reducer');
		return load(state);
	case LOAD_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_FAIL:
		return loadFail(state, action.error);
	case NARROW:
		return narrow(state);
	default:
		return ensureImmutable(state);
	}
}
