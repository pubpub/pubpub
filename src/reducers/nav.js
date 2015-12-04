import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	UPDATE_DELTA,
} from '../actions/nav';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	delta: 1, // Delta is used to track internal app routing. Hopefully so we can dismiss queries and modals properly even if directly navigated to.
	searchString: '',
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function updateDelta(state, delta) {
	return state.merge({
		delta: state.get('delta') + delta
	});
}

function updateDeltaOnRoute(state, action) {
	let deltaDiff = 0;
	if (action.payload.location.action === 'PUSH') {
		deltaDiff = 1;
	} else if (action.payload.location.action === 'POP') { // This break sometimes because forward navigation from the browser is also registered as a POP
		deltaDiff = -1;
	}

	return state.merge({
		delta: state.get('delta') + deltaDiff
	});

}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case UPDATE_DELTA:
		return updateDelta(state, action.delta);
	case '@@reduxReactRouter/routerDidChange': 
		return updateDeltaOnRoute(state, action);
	default:
		return ensureImmutable(state);
	}
}
