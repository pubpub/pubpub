import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	FUNK_LOAD,
	FUNK_SUCCESS,
	FUNK_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	output: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function loginLoading(state) {
	return state.merge({
		// loading: true,
		// error: undefined
	});
}

function loginSuccess(state, output) {
	return state.merge({
		output: output
		// loading: false,
		// error: undefined
	});
}

function loginFailed(state, error) {
	let errorMessage = '';
	switch (error.toString()) {
	default: 
		errorMessage = 'Something broke'; break;
	}

	return state.merge({
		// loading: false,
		// error: errorMessage
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case FUNK_LOAD:
		return loginLoading(state);
	case FUNK_SUCCESS:
		return loginSuccess(state, action.result.output);
	case FUNK_FAIL:
		return loginFailed(state, action.error);

	

	default:
		return ensureImmutable(state);
	}
}