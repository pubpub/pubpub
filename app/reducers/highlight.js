import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	CREATE_HIGHLIGHT_LOAD,
	CREATE_HIGHLIGHT_SUCCESS,
	CREATE_HIGHLIGHT_FAIL,
} from 'containers/Highlighter/actions';

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

	case CREATE_HIGHLIGHT_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case CREATE_HIGHLIGHT_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
		});
	case CREATE_HIGHLIGHT_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
