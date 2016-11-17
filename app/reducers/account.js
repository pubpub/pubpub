import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SIGN_UP_DATA_LOAD,
	GET_SIGN_UP_DATA_SUCCESS,
	GET_SIGN_UP_DATA_FAIL,
} from 'containers/CreateAccount/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	user: {},
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_SIGN_UP_DATA_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case GET_SIGN_UP_DATA_SUCCESS:
		return state.merge({
			loading: false,
			user: {
				email: action.result.email
			}
		});
	case GET_SIGN_UP_DATA_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	default:
		return ensureImmutable(state);
	}
}
