import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	UPDATE_DELTA,
	// OPEN_MENU,
	// CLOSE_MENU
} from '../actions/nav';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	// menuOpen: false,
	delta: 0,
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

// function openMenu(state) {
// 	return state.merge({
// 		menuOpen: true
// 	});
// }

// function closeMenu(state) {
// 	return state.merge({
// 		menuOpen: false
// 	});
// }


/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case UPDATE_DELTA:
		return updateDelta(state, action.delta);
	// case OPEN_MENU:
	// 	return openMenu(state);
	// case CLOSE_MENU:
	// 	return closeMenu(state);
	default:
		return ensureImmutable(state);
	}
}
