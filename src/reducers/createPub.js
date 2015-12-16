import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_PUB_LOAD,
	CREATE_PUB_SUCCESS,
	CREATE_PUB_FAIL,
} from '../actions/createPub';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	pubCreated: false,
	status: 'loaded',
	error: null,
	slug: null,
	title: undefined,
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function loading(state) {
	return state.merge({
		status: 'loading',
		error: null,
		slug: null,
	});
}

function pubCreated(state, result, title) {
	return state.merge({
		status: 'loaded',
		error: null,
		pubCreated: true,
		slug: result,
		title: title,
	});
}

function failed(state, error) {
	return state.merge({
		status: 'loaded',
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_PUB_LOAD:
		return loading(state);

	case CREATE_PUB_SUCCESS:
		return pubCreated(state, action.result, action.title);

	case CREATE_PUB_FAIL:
		return failed(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
