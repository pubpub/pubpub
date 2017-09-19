/* ---------- */
// Load Actions
/* ---------- */
import {
	POST_SIGNUP_LOAD,
	POST_SIGNUP_SUCCESS,
	POST_SIGNUP_FAIL,
} from 'actions/signup';

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
	case POST_SIGNUP_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined
		};
	case POST_SIGNUP_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_SIGNUP_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
