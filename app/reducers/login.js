import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	LOGIN_POST_LOAD,
	LOGIN_POST_SUCCESS,
	LOGIN_POST_FAIL,
} from 'containers/Login/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case LOGIN_POST_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case LOGIN_POST_SUCCESS:
		return state.merge({
			loading: false,
			error: false,
		});
	case LOGIN_POST_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	default:
		return ensureImmutable(state);
	}
}
