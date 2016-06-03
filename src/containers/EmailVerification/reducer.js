import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	EMAIL_VERIFICATION_SUCCESS,
} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	emailVerified: false,
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function verificationSuccess(state) {
	return state.merge({emailVerified: true});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case EMAIL_VERIFICATION_SUCCESS:
		return verificationSuccess(state);

	default:
		return ensureImmutable(state);
	}
}
