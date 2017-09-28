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
	data: undefined,
	isLoading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_SEARCH_RESULTS_LOAD:
		return {
			isLoading: true,
			error: undefined,
		};
	case GET_SEARCH_RESULTS_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_SEARCH_RESULTS_FAIL:
		return {
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
