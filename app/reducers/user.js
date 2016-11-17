import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_USER_DATA_LOAD,
	GET_USER_DATA_SUCCESS,
	GET_USER_DATA_FAIL,
} from 'containers/User/actions';

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
	
	case GET_USER_DATA_LOAD:
		return state.merge({
			loading: true,
			error: false,
		});	
	case GET_USER_DATA_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			user: action.result
		});
	case GET_USER_DATA_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
			user: null,
		});

	default:
		return ensureImmutable(state);
	}
}
