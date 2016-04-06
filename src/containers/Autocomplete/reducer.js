import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	AUTOCOMPLETE_LOAD,
	AUTOCOMPLETE_SUCCESS,
	AUTOCOMPLETE_FAIL,
	AUTOCOMPLETE_CLEAR
} from 'containers/Autocomplete/actions';

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
	return state.setIn([autocompleteKey, 'loading'], true);
}

function success(state, autocompleteKey, string, result) {
	return state.mergeIn([autocompleteKey], {
		loading: false,
		data: result,
		error: null,
		cache: state.setIn([autocompleteKey, 'cache', string], result).getIn([autocompleteKey, 'cache']),
	});
}

function failed(state, autocompleteKey, error) {
	console.log('in failed');
	console.log(error);

	return state.mergeIn([autocompleteKey], {
		loading: false,
		error: error
	});
}

function clear(state, autocompleteKey) {
	return state.mergeIn([autocompleteKey], {
		loading: false,
		data: null,
		error: null
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function autocompleteReducer(state = defaultState, action) {

	switch (action.type) {

	case AUTOCOMPLETE_LOAD:
		return loading(state, action.autocompleteKey);
	case AUTOCOMPLETE_SUCCESS:
		return success(state, action.autocompleteKey, action.string, action.result);
	case AUTOCOMPLETE_FAIL:
		return failed(state, action.autocompleteKey, action.error);
	case AUTOCOMPLETE_CLEAR:
		return clear(state, action.autocompleteKey);

	default:
		return ensureImmutable(state);
	}

}
