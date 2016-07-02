import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_JRNL_LOAD,
	GET_JRNL_SUCCESS,
	GET_JRNL_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	jrnlData: {},
	loading: false,
	error: null

});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function getJrnlLoad(state) {
	return state.set('loading', true);
}

function getJrnlSuccess(state, result) {
	return state.merge({
		jrnlData: result,
		loading: false,
		error: null,
	});
}

function getJrnlFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {
	switch (action.type) {
	case GET_JRNL_LOAD:
		return getJrnlLoad(state);
	case GET_JRNL_SUCCESS:
		return getJrnlSuccess(state, action.result);
	case GET_JRNL_FAIL:
		return getJrnlFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
