import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	SIGNUP_LOAD,
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loggedIn: false,
	userData: {},
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
	return state;
}

function signupSuccess(state) {
	return state;
}

function signupFailed(state) {
	return state;
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case SIGNUP_LOAD:
		return signupLoading(state);
	case SIGNUP_SUCCESS:
		return signupSuccess(state, action.result.loginData);
	case SIGNUP_FAIL:
		return signupFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
