/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SEARCH_RESULTS_LOAD,
	GET_SEARCH_RESULTS_SUCCESS,
	GET_SEARCH_RESULTS_FAIL,
} from 'actions/search';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	results: [],
	loading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_SEARCH_RESULTS_LOAD:
		return {
			loading: true,
			error: undefined,
		};
	case GET_SEARCH_RESULTS_SUCCESS:
		return {
			results: action.result,
			loading: false,
			error: undefined,
		};
	case GET_SEARCH_RESULTS_FAIL:
		return {
			loading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
