import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {LOAD, LOAD_SUCCESS, LOAD_FAIL} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
const defaultState = Immutable.Map({
	testGetEmpty: {},
	testGetParams: {},
	testPostEmpty: {},
	testPostData: {}
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function load(state) {
	return state.set('loading', 50);
}

function loadSuccess(state, result, test) {
	return state.set(test, result);
}

function loadFail(state, error, test) {
	console.log('in Load Fail');
	console.log(error);
	return state.set(test, error);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function subdomainReducer(state = defaultState, action) {
	switch (action.type) {
	case LOAD:
		return load(state);
	case LOAD_SUCCESS:
		return loadSuccess(state, action.result, action.test);
	case LOAD_FAIL:
		return loadFail(state, action.error, action.test);
	default:
		return ensureImmutable(state);
	}
}
