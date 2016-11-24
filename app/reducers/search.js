import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SEARCH_LOAD,
	GET_SEARCH_SUCCESS,
	GET_SEARCH_FAIL,
} from 'containers/Search/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	results: [],
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {

	case GET_SEARCH_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case GET_SEARCH_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			results: action.result,
		});
	case GET_SEARCH_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
