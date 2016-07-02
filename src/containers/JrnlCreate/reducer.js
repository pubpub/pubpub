import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_JRNL_LOAD,
	CREATE_JRNL_SUCCESS,
	CREATE_JRNL_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	newJrnlSlug: undefined,
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function createJrnlLoading(state) {
	return state.merge({
		loading: true,
		error: undefined
	});
}

function createJrnlSuccess(state, newJrnlSlug) {
	return state.merge({
		newJrnlSlug: newJrnlSlug,
		loading: false,
		error: undefined
	});
}

function createJrnlFailed(state, error) {
	return state.merge({
		loading: false, 
		error: error
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case CREATE_JRNL_LOAD:
		return createJrnlLoading(state);
	case CREATE_JRNL_SUCCESS:
		return createJrnlSuccess(state, action.result);
	case CREATE_JRNL_FAIL:
		return createJrnlFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
