import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	OPEN_MENU,
	CLOSE_MENU,
} from '../actions/nav';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	menuOpen: false, 
	searchString: '',
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function openMenu(state) {
	return state.merge({
		menuOpen: true,
	});
}

function closeMenu(state) {
	return state.merge({
		menuOpen: false,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case OPEN_MENU:
		return openMenu(state);
	case CLOSE_MENU:
		return closeMenu(state);
	default:
		return ensureImmutable(state);
	}
}
