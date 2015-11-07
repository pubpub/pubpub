import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	TOGGLE_MENU,
	CLOSE_MENU
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
function toggleMenu(state) {
	return state.merge({
		menuOpen: !state.get('menuOpen')
	});
}

function closeMenu(state) {
	return state.merge({
		menuOpen: false
	});
}


/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	case TOGGLE_MENU:
		return toggleMenu(state);
	case CLOSE_MENU:
		return closeMenu(state);
	default:
		return ensureImmutable(state);
	}
}
