import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	AUTOCOMPLETE_LOAD,
	AUTOCOMPLETE_SUCCESS,
	AUTOCOMPLETE_FAIL,
	AUTOCOMPLETE_CLEAR
} from '../actions/autocomplete';
/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function loading(state, autocompleteKey) {
	// const mergeState = {};
	// console.log(state);
	// console.log(state.getIn([autocompleteKey, 'data']));
	// const previousData = state.has(autocompleteKey) ? state.getIn([autocompleteKey, 'data']).toJS() : [];
	// console.log(previousData);
	// mergeState[autocompleteKey] = {
	// 	loading: true,
	// 	data: previousData
	// };
	

	return state.setIn([autocompleteKey, 'loading'], true);
}

function success(state, autocompleteKey, result) {
	const mergeState = {};
	mergeState[autocompleteKey] = {
		loading: false,
		data: result,
		error: null,
	};
	return state.merge(mergeState);
}

function failed(state, autocompleteKey, error) {
	console.log('in failed');
	console.log(error);
	const mergeState = {};
	mergeState[autocompleteKey] = {
		loading: false,
		error: error,
	};
	return state.merge(mergeState);
}

function clear(state, autocompleteKey) {
	const mergeState = {};
	mergeState[autocompleteKey] = {
		loading: false,
		data: null,
		error: null,
	};
	return state.merge(mergeState);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function autocompleteReducer(state = defaultState, action) {

	switch (action.type) {
	case AUTOCOMPLETE_LOAD:
		return loading(state, action.autocompleteKey);

	case AUTOCOMPLETE_SUCCESS:
		return success(state, action.autocompleteKey, action.result);

	case AUTOCOMPLETE_FAIL:
		return failed(state, action.autocompleteKey, action.error);

	case AUTOCOMPLETE_CLEAR: 
		return clear(state, action.autocompleteKey);

	default:
		return ensureImmutable(state);
	}
	
}
