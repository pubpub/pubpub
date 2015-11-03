import Immutable from 'immutable';

/*--------*/
// Load Actions
/*--------*/
import {} from '../actions/landing';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

// function sample() {}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function landingReducer(state = defaultState, action) {

	switch (action.type) {
	default:
		return state;
	}
}
