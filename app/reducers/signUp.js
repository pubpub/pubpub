import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	CREATE_SIGN_UP_LOAD,
	CREATE_SIGN_UP_SUCCESS,
	CREATE_SIGN_UP_FAIL,
} from 'containers/SignUp/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	destinationEmail: undefined,
	resendSuccess: false,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case CREATE_SIGN_UP_LOAD:
		return state.merge({
			loading: true,
			resendSuccess: false,
		});	
	case CREATE_SIGN_UP_SUCCESS:
		return state.merge({
			loading: false,
			destinationEmail: action.email,
			resendSuccess: !!state.get('destinationEmail')
		});
	case CREATE_SIGN_UP_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
			resendSuccess: false,
		});

	default:
		return ensureImmutable(state);
	}
}
