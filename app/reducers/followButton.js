import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	POST_FOLLOW_LOAD,
	POST_FOLLOW_SUCCESS,
	POST_FOLLOW_FAIL,
} from 'containers/followButton/actions';

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

	case POST_FOLLOW_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case POST_FOLLOW_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
		});
	case POST_FOLLOW_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
