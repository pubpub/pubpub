import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	SIGNUP_LOAD,
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,

	SIGNUP_DETAILS_LOAD,
	SIGNUP_DETAILS_SUCCESS,
	SIGNUP_DETAILS_FAIL,

	SIGNUP_FOLLOW_LOAD,
	SIGNUP_FOLLOW_SUCCESS,
	SIGNUP_FOLLOW_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	currentStage: 'signup',
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function signupLoading(state) {
	return state.merge({
		loading: true,
		error: undefined,
		currentStage: 'signup',
	});
}

function signupSuccess(state) {
	return state.merge({
		loading: false,
		error: undefined,
		currentStage: 'details',
	});
}

function signupFailed(state, error) {
	return state.merge({
		loading: false,
		error: error
	});
}

function detailsLoading(state) {
	return state.merge({
		loading: true,
		error: undefined
	});
}

function detailsSuccess(state) {
	return state;
}

function detailsFailed(state) {
	return state;
}

function followLoading(state) {
	return state.merge({
		loading: true,
		error: undefined
	});
}

function followSuccess(state) {
	return state;
}

function followFailed(state) {
	return state;
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case SIGNUP_LOAD:
		return signupLoading(state);
	case SIGNUP_SUCCESS:
		return signupSuccess(state);
	case SIGNUP_FAIL:
		return signupFailed(state, action.error);

	case SIGNUP_DETAILS_LOAD:
		return detailsLoading(state);
	case SIGNUP_DETAILS_SUCCESS:
		return detailsSuccess(state, action.result.loginData);
	case SIGNUP_DETAILS_FAIL:
		return detailsFailed(state, action.error);

	case SIGNUP_FOLLOW_LOAD:
		return followLoading(state);
	case SIGNUP_FOLLOW_SUCCESS:
		return followSuccess(state, action.result.loginData);
	case SIGNUP_FOLLOW_FAIL:
		return followFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
