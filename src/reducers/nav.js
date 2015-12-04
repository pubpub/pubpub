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
	delta: 1,
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
	console.log('hey hey! in custom!');
	console.log(action);
	console.log('action', action.payload.location.action);
	let deltaDiff = 0;
	if (action.payload.location.action === 'PUSH') {
		deltaDiff = 1;
	} else if (action.payload.location.action === 'POP') {
		deltaDiff = -1;
	}

	return state.merge({
		delta: state.get('delta') + deltaDiff
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
	case '@@reduxReactRouter/routerDidChange': 
		return updateDeltaOnRoute(state, action);
	// case OPEN_MENU:
	// 	return openMenu(state);
	// case CLOSE_MENU:
	// 	return closeMenu(state);
	default:
		return ensureImmutable(state);
	}
}
