/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_REDIRECT_LOAD,
	GET_PUB_REDIRECT_SUCCESS,
	GET_PUB_REDIRECT_FAIL,
} from 'actions/redirect';

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
	case GET_PUB_REDIRECT_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined
		};
	case GET_PUB_REDIRECT_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_PUB_REDIRECT_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
