import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {TOGGLE_VISIBILITY} from '../actions/login';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	isVisible: true
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function toggle(state) {
	return state.set('isVisible', !state.get('isVisible'));
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case TOGGLE_VISIBILITY:
		return toggle(state);
	default:
		return ensureImmutable(state);
	}
}
