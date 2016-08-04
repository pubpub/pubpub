import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	FOLLOW_LOAD,
	FOLLOW_SUCCESS,
	FOLLOW_FAIL,

	UNFOLLOW_LOAD,
	UNFOLLOW_SUCCESS,
	UNFOLLOW_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loading: false,
	error: false,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function followLoad(state) {
	return state.merge({
		loading: true,
		error: false,
	});
}

function followSuccess(state) {
	return state.merge({
		loading: false,
		error: false,
	});
}

function followFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {

	case FOLLOW_LOAD:
	case UNFOLLOW_LOAD:
		return followLoad(state);

	case UNFOLLOW_SUCCESS: 
	case FOLLOW_SUCCESS:
		return followSuccess(state);

	case UNFOLLOW_FAIL: 
	case FOLLOW_FAIL:
		return followFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
