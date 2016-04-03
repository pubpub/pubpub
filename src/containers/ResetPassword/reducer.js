import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	REQUEST_LOAD,
	REQUEST_SUCCESS,
	REQUEST_FAIL,

	HASH_LOAD,
	HASH_SUCCESS,
	HASH_FAIL,

	RESET_LOAD,
	RESET_SUCCESS,
	RESET_FAIL,
} from './actions';
/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loading: false,
	resetSuccess: null, // valid when hash is valid. invalid when hash is invalid. success when reset complete.
	requestSuccess: null, // success when succesfully requested on backend, error when email not found
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function loading(state) {
	return state.merge({
		loading: true,
	});
}

function requestResetSuccess(state, result) {
	return state.merge({
		loading: false,
		requestSuccess: result === 'User Not Found' ? 'error' : 'success',
	});
}

function requestResetFail(state, error) {
	return state.merge({
		loading: false,
		requestSuccess: 'error',
	});
}

function hashSuccess(state, result) {
	return state.merge({
		loading: false,
		resetSuccess: result === 'valid' ? 'valid' : 'invalid',
	});
}

function hashFailed(state, error) {
	return state.merge({
		loading: false,
		resetSuccess: 'invalid',
	});
}

function resetPasswordSuccess(state, result) {
	return state.merge({
		loading: false,
		resetSuccess: result === 'success' ? 'success' : 'invalid',
	});
}

function resetPasswordFailed(state, error) {
	return state.merge({
		loading: false,
		resetSuccess: 'invalid',
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function autocompleteReducer(state = defaultState, action) {

	switch (action.type) {
	case REQUEST_LOAD:
		return loading(state);
	case REQUEST_SUCCESS:
		return requestResetSuccess(state, action.result);
	case REQUEST_FAIL:
		return requestResetFail(state, action.error);

	case HASH_LOAD:
		return loading(state);
	case HASH_SUCCESS:
		return hashSuccess(state, action.result);
	case HASH_FAIL:
		return hashFailed(state, action.error);

	case RESET_LOAD:
		return loading(state);
	case RESET_SUCCESS:
		return resetPasswordSuccess(state, action.result);
	case RESET_FAIL:
		return resetPasswordFailed(state, action.error);

	default:
		return ensureImmutable(state);
	}

}
