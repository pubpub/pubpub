import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	GET_MEDIA_LOAD,
	GET_MEDIA_SUCCESS,
	GET_MEDIA_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	mediaItems: [],
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function getMediaLoading(state) {
	return state.merge({
		loading: true,
		error: undefined,
	});
}

function getMediaSuccess(state, result) {
	return state.merge({
		mediaItems: result,
		loading: false,
		error: undefined,
	});
}

function getMediaFailed(state, error) {
	return state.merge({
		loading: true,
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case GET_MEDIA_LOAD:
		return getMediaLoading(state);
	case GET_MEDIA_SUCCESS:
		return getMediaSuccess(state, action.result);
	case GET_MEDIA_FAIL:
		return getMediaFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
