import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	ANALYTICS_LOAD,
	ANALYTICS_SUCCESS,
	ANALYTICS_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	data: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function analyticsLoading(state) {
	return state.merge({
		data: undefined,
		// loading: true,
		// error: undefined
	});
}

//NOTE clean this
function analyticsSuccess(state, result) {
	return state.merge({
		data: result
		// loading: false,
		// error: undefined
	});
}

function analyticsFailed(state, error) {
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
	case ANALYTICS_LOAD:
		return analyticsLoading(state);
	case ANALYTICS_SUCCESS:
		return analyticsSuccess(state, action.result);
	case ANALYTICS_FAIL:
		return analyticsFailed(state, action.error);

	

	default:
		return ensureImmutable(state);
	}
}