import Immutable from 'immutable';

/*--------*/
// Load Actions
/*--------*/
import {NARROW, LOAD, LOAD_SUCCESS, LOAD_FAIL} from '../actions/editor';

/*--------*/
// Initialize Default State 
/*--------*/
const defaultState = Immutable.Map({
	narrowMode: 'wide',
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function narrow(state) {
	let newMode = undefined;
	if (state.narrowMode === 'narrow') {
		newMode = 'wide';
	} else {
		newMode = 'narrow';
	}
	return newMode;
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function editorReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD:
		console.log('in Load');
		return {
			...state,
			loading: 50
		};
	case LOAD_SUCCESS:
		console.log('in load success');
		// console.log(action);
		return {
			...state,
			loading: 100,
			loaded: true,
			sampleOutput: action.result,
			error: null
		};
	case LOAD_FAIL:
		return {
			...state,
			loading: false,
			loaded: false,
			data: null,
			error: action.error
		};
	case NARROW:
		return {
			...state,
			narrowMode: narrow(state)
		};
	default:
		return state;
	}
}
